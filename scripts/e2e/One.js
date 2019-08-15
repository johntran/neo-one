const _ = require('lodash');
const appRootDir = require('app-root-dir');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const tmp = require('tmp');
const checkPort = require('./checkPort');
class One {
  constructor() {
    this.mutableCleanup = [];
  }

  addCleanup(callback) {
    this.mutableCleanup.push(callback);
  }

  async cleanupTest() {
    const mutableCleanup = this.mutableCleanup;
    this.mutableCleanup = [];
    await Promise.all(mutableCleanup.map(async (callback) => callback()));
  }

  async teardown() {
    if (this.server === undefined) {
      return;
    }

    try {
      await this._exec('reset --static-neo-one');
    } catch (error) {
      this.server.kill('SIGINT');
      await new Promise((resolve) => setTimeout(() => resolve(), 2500));
      this.server.kill('SIGTERM');
    }

    await fs.remove(this.dir.name);

    await this.cleanupTest();
  }

  async execute(command, options = {}) {
    await this.setupCLI();
    return this._exec(command, options);
  }

  async getAvailableMinPortForRange(range, start = 10000) {
    const portRange = _.range(start, start + range);

    const results = await Promise.all(
      portRange.map(async (port) => {
        return checkPort(port);
      }),
    );

    if (results.some((taken) => taken)) {
      return this.getAvailableMinPortForRange(range, start + range);
    }

    return start;
  }

  async configurePorts() {
    this.serverPort = await this.getAvailableMinPortForRange(30);
    this.httpServerPort = this.serverPort + 1;
    this.minPort = this.serverPort + 2;
  }

  async setupCLI() {
    if (this.server !== undefined) {
      return;
    }

    this.dir = tmp.dirSync();
    this.dirName = this.dir.name;
    await this.configurePorts();
    const [cmd, args] = this._createCommand('start server --static-neo-one');
    this.server = execa(cmd, args, this._getEnv());

    let stdout = '';
    const stdoutListener = (res) => {
      stdout += res;
    };
    this.server.stdout.on('data', stdoutListener);

    let stderr = '';
    const stderrListener = (res) => {
      stderr += res;
    };
    this.server.stderr.on('data', stderrListener);

    let exited = false;
    const exitListener = () => {
      exited = true;
    };
    this.server.on('exit', exitListener);

    let tries = 60;
    let ready = false;
    while (!ready && !exited && tries >= 0) {
      await new Promise((resolve) => setTimeout(() => resolve(), 1000));
      const result = await this._exec('check server --static-neo-one');
      try {
        const lines = result.split('\n').filter((line) => line !== '');
        ready = JSON.parse(lines[lines.length - 1]);
      } catch (error) {
        // Ignore errors
      }
      tries -= 1;
    }

    this.server.stdout.removeListener('data', stdoutListener);
    this.server.stdout.removeListener('data', stderrListener);
    this.server.removeListener('exit', exitListener);

    if (!ready) {
      await this.teardown();
      throw new Error(
        `Failed to start NEO-ONE server.\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`,
      );
    }
  }

  parseJSON(value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error(`Value:\n${value}\n\nError:\n${error.toString()}`);
    }
  }

  async until(func, timeoutMSIn) {
    const start = Date.now();
    const timeoutMS = timeoutMSIn == null ? 90 * 1000 : timeoutMSIn;
    let finalError;
    while (Date.now() - start < timeoutMS) {
      try {
        await func();
        return;
      } catch (error) {
        finalError = error;
        await new Promise((resolve) => setTimeout(() => resolve(), 1000));
      }
    }

    throw finalError;
  }

  async measureRequire(mod) {
    return this._timeRequire(mod);
  }

  async _timeRequire(mod) {
    await this._timeRequireSingle(mod);

    return this._timeRequireSingle(mod);
  }

  async _timeRequireSingle(mod) {
    const { stdout } = await execa(
      `node --eval "const start = Date.now(); require('${mod}'); console.log(Date.now() - start);"`,
      { cwd: path.join(appRootDir.get(), 'dist', 'neo-one'), shell: true },
    );

    return parseInt(stdout);
  }

  _createCommand(commandIn) {
    const cmd = path.resolve(
      process.cwd(),
      'dist',
      'neo-one',
      'node_modules',
      '.bin',
      'neo-one',
    );
    const command = `${cmd} ${commandIn} --dir ${this.dirName} --server-port ${this.serverPort} --http-server-port ${this.httpServerPort} --min-port ${this.minPort}`;
    let additionalArgs = [];
    if (commandIn.startsWith('create') || commandIn.startsWith('delete')) {
      additionalArgs = ['--no-progress'];
    }

    return [
      command.split(' ')[0],
      command
        .split(' ')
        .slice(1)
        .concat(additionalArgs),
    ];
  }

  _exec(commandIn, options = {}) {
    const [cmd, args] = this._createCommand(commandIn);
    return execa(cmd, args, this._getEnv(options))
      .then(({ stdout }) => stdout)
      .catch((error) => {
        throw new Error(
          `Command:\n${[cmd].concat(args).join(' ')}\n\nSTDOUT:\n${
            error.stdout
          }\n\nSTDERR:\n${error.stderr}\n\nERROR:\n${error.toString()}`,
        );
      });
  }

  _getEnv(options = {}) {
    return {
      ...options,
      maxBuffer: 20000 * 1024,
      windowsHide: true,
    };
  }
}
module.exports = One;
module.exports.default = One;
