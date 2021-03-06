import { BuiltinInterface } from '../BuiltinInterface';
import { Builtins } from '../Builtins';
import { BuiltinValueObject } from '../BuiltinValueObject';
import { ObjectKeys } from './keys';

class ObjectInterface extends BuiltinInterface {}
class ObjectValue extends BuiltinValueObject {
  public readonly type = 'ObjectConstructor';
}
class ObjectConstructorInterface extends BuiltinInterface {}

// tslint:disable-next-line export-name
export const add = (builtins: Builtins): void => {
  builtins.addInterface('Object', new ObjectInterface());
  builtins.addValue('Object', new ObjectValue());
  builtins.addInterface('ObjectConstructor', new ObjectConstructorInterface());
  builtins.addGlobalMember('ObjectConstructor', 'keys', new ObjectKeys());
};
