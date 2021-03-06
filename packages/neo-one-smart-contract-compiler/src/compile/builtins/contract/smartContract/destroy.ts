import { tsUtils } from '@neo-one/ts-utils';
import ts from 'typescript';
import { ScriptBuilder } from '../../../sb';
import { VisitOptions } from '../../../types';
import { BuiltinInstanceMemberCall } from '../../BuiltinInstanceMemberCall';
import { CallMemberLikeExpression } from '../../types';

// tslint:disable-next-line export-name
export class SmartContractDestroy extends BuiltinInstanceMemberCall {
  public canCall(_sb: ScriptBuilder, _func: CallMemberLikeExpression, node: ts.CallExpression): boolean {
    return tsUtils.argumented.getArguments(node).length === 0;
  }

  public emitCall(
    sb: ScriptBuilder,
    _func: CallMemberLikeExpression,
    node: ts.CallExpression,
    optionsIn: VisitOptions,
    visited: boolean,
  ): void {
    if (visited) {
      // []
      sb.emitOp(node, 'DROP');
    }

    sb.emitSysCall(node, 'Neo.Contract.Destroy');

    if (optionsIn.pushValue) {
      // [val]
      sb.emitHelper(node, optionsIn, sb.helpers.wrapUndefined);
    }
  }
}
