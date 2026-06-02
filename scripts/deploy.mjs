import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const pm2 = process.platform === 'win32' ? 'pm2.cmd' : 'pm2';
const git = process.platform === 'win32' ? 'git.exe' : 'git';
const shell = process.platform === 'win32' ? 'powershell.exe' : 'sh';
const serverEntry = '.next/standalone/server.js';
const installCommand = existsSync('package-lock.json') ? ['ci', '--include=dev'] : ['install', '--include=dev'];
const port = process.env.PORT ?? '3000';
const localLoginUrl = `http://127.0.0.1:${port}/login`;
const localProxyHealthUrl = `http://127.0.0.1:${port}/api/health`;
const publicLoginUrl = process.env.PUBLIC_ADMIN_URL ?? 'https://tovapulse.com/login';
const adminAppName = 'tovapulse-admin';

function run(command, args, { allowFail = false } = {}) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'inherit',
  });

  if (result.status !== 0 && !allowFail) {
    process.exit(result.status ?? 1);
  }

  return result.status ?? 1;
}

function output(command, args) {
  return spawnSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function runDiagnostic(command, args) {
  console.log(`\n[diagnostic] $ ${command} ${args.join(' ')}`);
  spawnSync(command, args, {
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'inherit',
  });
}

function printFailureDiagnostics(url) {
  console.error(`\nDeployment check failed for ${url}. Printing origin diagnostics...`);
  runDiagnostic(pm2, ['status']);
  runDiagnostic(pm2, ['describe', adminAppName]);
  runDiagnostic(pm2, ['logs', adminAppName, '--lines', '120', '--nostream']);
  runDiagnostic(pm2, ['logs', 'tovapulse-api', '--lines', '80', '--nostream']);
  runDiagnostic(process.execPath, ['--version']);
  runDiagnostic(npm, ['--version']);

  if (process.platform === 'win32') {
    runDiagnostic(shell, ['-NoProfile', '-Command', `Test-NetConnection 127.0.0.1 -Port ${port}`]);
    runDiagnostic(shell, ['-NoProfile', '-Command', `try { Invoke-WebRequest -UseBasicParsing ${localLoginUrl} } catch { $_.Exception.Message }`]);
    runDiagnostic(shell, ['-NoProfile', '-Command', `try { Invoke-WebRequest -UseBasicParsing ${localProxyHealthUrl} } catch { $_.Exception.Message }`]);
  } else {
    runDiagnostic(shell, ['-lc', `curl -i --max-time 10 ${localLoginUrl} || true`]);
    runDiagnostic(shell, ['-lc', `curl -i --max-time 10 ${localProxyHealthUrl} || true`]);
    runDiagnostic(shell, ['-lc', 'ss -ltnp || netstat -ltnp || true']);
    runDiagnostic(shell, ['-lc', 'nginx -t || true']);
    runDiagnostic(shell, ['-lc', 'systemctl status nginx --no-pager -l || true']);
  }
}

function readEnvFile(filePath) {
  if (!existsSync(filePath)) return {};

  return Object.fromEntries(
    readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const index = line.indexOf('=');
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, '');
        return [key, value];
      }),
  );
}

function validateUrl(value, label, { httpsOnly = false } = {}) {
  try {
    const parsed = new URL(value);
    if (httpsOnly && parsed.protocol !== 'https:') {
      throw new Error(`${label} must use https`);
    }
    return parsed;
  } catch {
    console.error(`\n${label} is invalid: ${value}`);
    process.exit(1);
  }
}

function validateEnv() {
  const envPath = existsSync('.env.production.local') ? '.env.production.local' : '.env.local';
  const env = readEnvFile(envPath);
  const isProductionEnv = envPath.includes('production');

  if (!existsSync(envPath)) {
    console.error('\nAdmin env file is missing. Create .env.production.local before deploy.');
    process.exit(1);
  }

  if (env.NEXT_PUBLIC_API_URL !== '/api/backend') {
    console.error('\nNEXT_PUBLIC_API_URL must be /api/backend to avoid browser CORS errors.');
    process.exit(1);
  }

  if (!env.NEXT_PUBLIC_API_BASE_URL) {
    console.error('\nNEXT_PUBLIC_API_BASE_URL is missing.');
    process.exit(1);
  }

  const publicApiBase = validateUrl(env.NEXT_PUBLIC_API_BASE_URL, 'NEXT_PUBLIC_API_BASE_URL', {
    httpsOnly: isProductionEnv,
  });

  if (publicApiBase.hostname === 'localhost' || publicApiBase.hostname === '127.0.0.1') {
    console.warn('\nWarning: NEXT_PUBLIC_API_BASE_URL points to localhost.');
  }

  if (env.BACKEND_API_BASE_URL) {
    validateUrl(env.BACKEND_API_BASE_URL, 'BACKEND_API_BASE_URL');
  } else {
    console.warn('\nWarning: BACKEND_API_BASE_URL is missing. Admin proxy will use NEXT_PUBLIC_API_BASE_URL.');
  }
}

function pullLatest() {
  const insideGit = output(git, ['rev-parse', '--is-inside-work-tree']);
  if (insideGit.status !== 0) {
    console.warn('\nWarning: health-admin is not a git repository. Skipping git pull.');
    return;
  }

  const status = output(git, ['status', '--porcelain']);
  if (status.status !== 0) {
    console.error('\nUnable to check git status.');
    process.exit(1);
  }

  if (status.stdout.trim()) {
    console.error('\nCannot pull: health-admin has local changes.');
    console.error('Commit or clean changes first, then run npm run deploy again.');
    process.exit(1);
  }

  run(git, ['pull', '--ff-only']);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHttp(url, { attempts = 20, delayMs = 1500, required = true } = {}) {
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      const text = await response.text().catch(() => '');

      if (response.ok) {
        console.log(`OK ${url} -> ${response.status}`);
        return true;
      }

      lastError = `${response.status} ${text.slice(0, 300)}`;
      console.log(`Waiting for ${url} (${attempt}/${attempts}) -> ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      console.log(`Waiting for ${url} (${attempt}/${attempts}) -> ${lastError}`);
    }

    await sleep(delayMs);
  }

  const message = `Smoke check failed for ${url}: ${lastError ?? 'unknown error'}`;
  if (required) {
    console.error(`\n${message}`);
    printFailureDiagnostics(url);
    process.exit(1);
  }

  console.warn(`\nWarning: ${message}`);
  return false;
}

pullLatest();
validateEnv();

run(npm, ['cache', 'verify']);
run(npm, installCommand);
rmSync('.next', { recursive: true, force: true });
run(npm, ['run', 'build']);
if (!existsSync(serverEntry)) {
  console.error(`\nBuild did not create ${serverEntry}. Deployment stopped.`);
  process.exit(1);
}

run(pm2, ['delete', adminAppName], { allowFail: true });
run(pm2, ['start', 'ecosystem.config.cjs', '--env', 'production', '--update-env']);
await waitForHttp(localLoginUrl, { required: true });
await waitForHttp(localProxyHealthUrl, { attempts: 5, required: true });
await waitForHttp(publicLoginUrl, { attempts: 5, required: true });
run(pm2, ['status']);
run(pm2, ['save']);
run(pm2, ['flush'], { allowFail: true });

console.log('\nhealth-ai-admin deployed.');
