import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const standaloneDir = path.join(root, '.next', 'standalone');

if (!existsSync(standaloneDir)) {
  throw new Error('Next standalone output was not found. Run next build with output: "standalone".');
}

function copyDirectory(source, destination) {
  if (!existsSync(source)) {
    return;
  }

  rmSync(destination, { recursive: true, force: true });
  mkdirSync(path.dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true });
}

copyDirectory(path.join(root, 'public'), path.join(standaloneDir, 'public'));
copyDirectory(path.join(root, '.next', 'static'), path.join(standaloneDir, '.next', 'static'));
