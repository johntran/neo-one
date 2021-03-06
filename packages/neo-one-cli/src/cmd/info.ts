import { configToSerializable } from '@neo-one/cli-common-node';
import yargs from 'yargs';
import { start } from '../common';

export const command = 'info';
export const describe = 'Prints project configuration.';
export const builder = (yargsBuilder: typeof yargs) => yargsBuilder;
export const handler = () => {
  start(async (_cmd, config) => {
    // tslint:disable-next-line no-console
    console.log(JSON.stringify(configToSerializable(config), undefined, 2));
  });
};
