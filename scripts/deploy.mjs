import { spawnSync } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const pm2 = process.platform === 'win32' ? 'pm2.cmd' : 'pm2';

function run(command, args, { allowFail = false } = {}) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { stdio: 'inherit' });

  if (result.status !== 0 && !allowFail) {
    process.exit(result.status ?? 1);
  }

  return result.status ?? 1;
}

run(npm, ['run', 'build']);

const reloadStatus = run(pm2, ['reload', 'ecosystem.config.cjs', '--env', 'production', '--update-env'], {
  allowFail: true,
});

if (reloadStatus !== 0) {
  run(pm2, ['start', 'ecosystem.config.cjs', '--env', 'production']);
}

console.log('\nhealth-admin deployed.');
