import { nep5 } from '@neo-one/client-full';
import { genABI } from '../../abi';

describe('genABI', () => {
  test('NEP5', () => {
    expect(genABI('Token', nep5.abi(4))).toMatchSnapshot();
  });
});
