import { ABI } from '@neo-one/client-core';
import { genEvent } from './genEvent';
import { genReadSmartContract } from './genReadSmartContract';
import { genSmartContract } from './genSmartContract';
import { getEventName } from './getEventName';
import { getSingleEventName } from './getSingleEventName';

const getImportClauses = (text: string) => {
  const mutableClauses: string[] = [];

  if (text.includes('BufferString')) {
    mutableClauses.push('BufferString');
  }

  if (text.includes('SignatureString')) {
    mutableClauses.push('SignatureString');
  }

  if (text.includes('AddressString')) {
    mutableClauses.push('AddressString');
  }

  if (text.includes('Hash256String')) {
    mutableClauses.push('Hash256String');
  }

  if (text.includes('PublicKeyString')) {
    mutableClauses.push('PublicKeyString');
  }

  if (text.includes('TransactionResult')) {
    mutableClauses.push('TransactionResult');
  }

  if (text.includes('InvokeReceipt')) {
    mutableClauses.push('InvokeReceipt');
  }

  if (text.includes('Event<')) {
    mutableClauses.push('Event');
  }

  if (text.includes('InvokeSendTransactionOptions')) {
    mutableClauses.push('InvokeSendTransactionOptions');
  }

  if (text.includes('InvokeReceiveTransactionOptions')) {
    mutableClauses.push('InvokeReceiveTransactionOptions');
  }

  if (text.includes('InvokeSendReceiveTransactionOptions')) {
    mutableClauses.push('InvokeSendReceiveTransactionOptions');
  }

  if (text.includes('InvokeClaimTransactionOptions')) {
    mutableClauses.push('InvokeClaimTransactionOptions');
  }

  if (text.includes('TransactionReceipt')) {
    mutableClauses.push('TransactionReceipt');
  }

  if (text.includes('ClaimTransaction')) {
    mutableClauses.push('ClaimTransaction');
  }

  if (text.includes('InvocationTransaction')) {
    mutableClauses.push('InvocationTransaction');
  }

  if (text.includes('TransactionOptions')) {
    mutableClauses.push('TransactionOptions');
  }

  return mutableClauses;
};

export const genSmartContractTypes = (name: string, abi: ABI) => {
  const events = abi.events === undefined ? [] : abi.events;
  const text = `
${events.map((event) => genEvent(name, event)).join('\n')}
${genSmartContract(name, abi)}${genReadSmartContract(name, abi)}`;

  const importClauses = getImportClauses(text).concat(['SmartContract', 'ReadSmartContract']);
  // tslint:disable-next-line no-array-mutation
  importClauses.sort();

  const bigNumberImport = text.includes('BigNumber') ? "\nimport BigNumber from 'bignumber.js';" : '';

  const importDecl = `import { ${importClauses.join(', ')} } from '@neo-one/client';${bigNumberImport}`;
  const eventType = `export type ${getEventName(name)} = ${
    events.length === 0 ? 'never' : events.map((event) => getSingleEventName(name, event.name)).join(' | ')
  }`;

  return {
    ts: `${importDecl}

${eventType}
${text}`,
  };
};
