// tslint:disable: match-default-export-name
import { getPretty } from '@neo-one/logger-config';
import pino from 'pino';

const createLogger = (name: string, options: pino.LoggerOptions = {}) =>
  options.browser !== undefined
    ? pino({ ...options, name, prettyPrint: getPretty() })
    : pino(
        { ...options, name, prettyPrint: getPretty() },
        process.env.NODE_ENV === 'production' ? pino.extreme(1) : pino.destination(1),
      );

// tslint:disable-next-line: strict-type-predicates
const browserOptions = typeof window !== 'undefined' ? { browser: { asObject: true } } : {};

export const editorLogger = createLogger('editor-server', browserOptions);
export const serverLogger = createLogger('server', browserOptions);
export const nodeLogger = createLogger('node', browserOptions);
export const rpcLogger = createLogger('rpc', browserOptions);
export const cliLogger = createLogger('cli', browserOptions);
export const httpLogger = createLogger('http', browserOptions);
export const testLogger = createLogger('test', browserOptions);

// tslint:disable-next-line: no-let
let loggers: readonly pino.Logger[] = [
  editorLogger,
  serverLogger,
  nodeLogger,
  rpcLogger,
  cliLogger,
  httpLogger,
  testLogger,
];
export const setGlobalLogLevel = (level: pino.LevelWithSilent) =>
  loggers.forEach((logger) => {
    // tslint:disable-next-line no-object-mutation
    logger.level = level;
  });

export const getFinalLogger = (logger: pino.Logger) => pino.final(logger);

export const createChild = (
  parent: pino.Logger,
  bindings: {
    readonly level?: pino.LevelWithSilent | string;
    // tslint:disable-next-line: no-any
    readonly [key: string]: any;
  },
) => {
  const child = parent.child(bindings);
  loggers = loggers.concat(child);

  return child;
};