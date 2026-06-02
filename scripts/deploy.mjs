import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const pm2 = process.platform === 'win32' ? 'pm2.cmd' : 'pm2';
const serverEntry = '.next/standalone/server.js';
const installCommand = existsSync('package-lock.json') ? ['ci', '--include=dev'] : ['install', '--include=dev'];

function run(command, args, { allowFail = false } = {}) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { stdio: 'inherit' });

  if (result.status !== 0 && !allowFail) {
    process.exit(result.status ?? 1);
  }

  return result.status ?? 1;
}

run(npm, installCommand);
run(npm, ['run', 'build']);
if (!existsSync(serverEntry)) {
  console.error(`\nBuild did not create ${serverEntry}. Deployment stopped.`);
  process.exit(1);
}

const reloadStatus = run(pm2, ['reload', 'ecosystem.config.cjs', '--env', 'production', '--update-env'], {
  allowFail: true,
});

if (reloadStatus !== 0) {
  run(pm2, ['start', 'ecosystem.config.cjs', '--env', 'production']);
}

run(pm2, ['save']);

console.log('\nhealth-ai-admin deployed.');
