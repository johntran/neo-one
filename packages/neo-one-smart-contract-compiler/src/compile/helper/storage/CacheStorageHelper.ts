import ts from 'typescript';
import { GlobalProperty } from '../../constants';
import { ScriptBuilder } from '../../sb';
import { VisitOptions } from '../../types';
import { Helper } from '../Helper';

// Input: []
// Output: [value]
export class CacheStorageHelper extends Helper {
  public readonly needsGlobal: boolean = true;
  public readonly needsGlobalOut = true;

  public emitGlobal(sb: ScriptBuilder, node: ts.Node, _options: VisitOptions): void {
    // [number, globalObject]
    sb.emitPushInt(node, GlobalProperty.CacheStorage);
    // [map, number, globalObject]
    sb.emitOp(node, 'NEWMAP');
    // []
    sb.emitOp(node, 'SETITEM');
  }

  public emitGlobalOut(sb: ScriptBuilder, node: ts.Node, optionsIn: VisitOptions): void {
    const options = sb.pushValueOptions(optionsIn);

    // [number, globalObject]
    sb.emitPushInt(node, GlobalProperty.CacheStorage);
    // [map]
    sb.emitOp(node, 'PICKITEM');
    // [number, map]
    sb.emitSysCall(node, 'Neo.Runtime.GetTrigger');
    // [number, number, map]
    sb.emitPushInt(node, 0x10);
    sb.emitHelper(
      node,
      options,
      sb.helpers.if({
        condition: () => {
          // [boolean, map]
          sb.emitOp(node, 'NUMEQUAL');
        },
        whenTrue: () => {
          // []
          sb.emitHelper(
            node,
            options,
            sb.helpers.mapForEach({
              each: () => {
                // [context, keyBuffer, valBuffer]
                sb.emitSysCall(node, 'Neo.Storage.GetContext');
                // []
                sb.emitSysCall(node, 'Neo.Storage.Put');
              },
            }),
          );
        },
        whenFalse: () => {
          // []
          sb.emitOp(node, 'DROP');
        },
      }),
    );
  }

  public emit(sb: ScriptBuilder, node: ts.Node, options: VisitOptions): void {
    if (!options.pushValue) {
      /* istanbul ignore next */
      return;
    }
    // [map]
    sb.emitHelper(node, options, sb.helpers.getGlobalProperty({ property: GlobalProperty.CacheStorage }));
  }
}
