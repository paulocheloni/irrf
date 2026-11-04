/**
 * Create React App 4 (webpack 4) hashes with OpenSSL's MD4. Node.js 17 and
 * later ship OpenSSL 3, which rejects that algorithm unless the legacy
 * provider is enabled. This stays on react-scripts 4; a move to webpack 5
 * (react-scripts 5 or off CRA) is a follow-up.
 */
const { spawn } = require('child_process');
const { resolve } = require('path');

const legacyProvider = '--openssl-legacy-provider';
const preload = `--require ${resolve(__dirname, 'sass-loader-expanded.js')}`;
const currentOptions = process.env.NODE_OPTIONS || '';
const extraOptions = [];
if (!currentOptions.includes(legacyProvider)) {
  extraOptions.push(legacyProvider);
}
if (!currentOptions.includes('sass-loader-expanded.js')) {
  extraOptions.push(preload);
}
const nodeOptions = [currentOptions, ...extraOptions].filter(Boolean).join(' ');

const child = spawn(
  process.execPath,
  [
    resolve(__dirname, '../node_modules/react-scripts/bin/react-scripts.js'),
    ...process.argv.slice(2),
  ],
  {
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: nodeOptions },
  },
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code === null ? 1 : code);
});

child.on('error', (error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
