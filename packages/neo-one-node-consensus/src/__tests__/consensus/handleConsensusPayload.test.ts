// wallaby.skip
import { PrivateKey } from '@neo-one/client-common';
import {
  ChangeViewConsensusMessage,
  ConsensusMessage,
  ConsensusPayload,
  UnsignedConsensusPayload,
} from '@neo-one/node-core';
import { context } from '../../__data__';
import { ConsensusContext } from '../../ConsensusContext';
import { Context } from '../../context';
import { handleConsensusPayload } from '../../handleConsensusPayload';

const consensusContext = new ConsensusContext();

const makePayload = ({
  context: contextIn,
  consensusMessage,
  privateKey,
}: {
  readonly context: Context;
  readonly consensusMessage: ConsensusMessage;
  readonly privateKey: PrivateKey;
}) =>
  ConsensusPayload.sign(
    new UnsignedConsensusPayload({
      version: contextIn.version,
      previousHash: contextIn.previousHash,
      blockIndex: contextIn.blockIndex,
      validatorIndex: contextIn.myIndex,
      consensusMessage,
    }),

    privateKey,
  );

describe('handleConsensusPayload', () => {
  // tslint:disable-next-line no-any
  let node = {} as any;
  beforeEach(() => {
    // tslint:disable-next-line no-any
    node = {} as any;
  });

  test('updates the expected view on new view number', async () => {
    const result = await handleConsensusPayload({
      context: context.initialBackupContext,
      node,
      privateKey: context.backupPrivateKey,
      payload: makePayload({
        context: context.blockSentPrimaryContext,
        consensusMessage: new ChangeViewConsensusMessage({
          viewNumber: context.blockSentPrimaryContext.viewNumber,
          newViewNumber: context.blockSentPrimaryContext.viewNumber + 1,
        }),

        privateKey: context.primaryPrivateKey,
      }),

      consensusContext,
    });

    expect(result.context.expectedView[context.blockSentPrimaryContext.myIndex]).toEqual(1);
  });
});
