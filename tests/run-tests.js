/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable eslint-comments/no-unlimited-disable */
const { spawn } = require('child_process');
// eslint-disable-next-line import/no-extraneous-dependencies
const { kill } = require('cross-port-killer');

const env = Object.create(process.env);
env.BROWSER = 'none';
env.TEST = true;
env.UMI_UI = 'none';
env.PROGRESS = 'none';
// flag to prevent multiple test
let once = false;

const startServer = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['start'], {
  env,
});

startServer.stderr.on('data', data => {
  // eslint-disable-next-line
});

startServer.on('exit', () => {
  kill(process.env.PORT || 8000);
});

startServer.stdout.on('data', data => {
  // hack code , wait umi
  if (
    (!once && data.toString().indexOf('Compiled successfully') >= 0) ||
    data.toString().indexOf('Theme generated successfully') >= 0
  ) {
    // eslint-disable-next-line
    once = true;
    const testCmd = spawn(
      /^win/.test(process.platform) ? 'npm.cmd' : 'npm',
      ['test', '--', '--maxWorkers=1', '--runInBand'],
      {
        stdio: 'inherit',
      },
    );
    testCmd.on('exit', code => {
      startServer.kill();
      process.exit(code);
    });
  }
});
