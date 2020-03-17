import { ContractParameterTypeModel } from './ContractParameterTypeModel';
import { RelayResultReasonModel } from './RelayResultReasonModel';
import { StateDescriptorTypeModel } from './StateDescriptorTypeModel';
import { StorageFlagsModel } from './StorageFlagsModel';
import { AttributeUsageModel } from './transaction';
import { WitnessScopeModel } from './WitnessScopeModel';

export interface ContractParameterDeclarationJSON {
  readonly type: keyof typeof ContractParameterTypeModel;
  readonly name: string;
}

export interface ArrayContractParameterJSON extends ContractParameterDeclarationJSON {
  readonly type: 'Array';
  readonly value: readonly ContractParameterJSON[];
}

export interface BooleanContractParameterJSON extends ContractParameterDeclarationJSON {
  readonly type: 'Boolean';
  readonly value: boolean;
}

export interface ByteArrayContractParameterJSON extends ContractParameterDeclarationJSON {
  readonly type: 'ByteArray';
  readonly value: string;
}

export interface Hash160ContractParameterJSON extends ContractParameterDeclarationJSON {
  readonly type: 'Hash160';
  readonly value: string;
}

export interface Hash256ContractParameterJSON extends ContractParameterDeclarationJSON {
  readonly type: 'Hash256';
  readonly value: string;
}

export interface IntegerContractParameterJSON extends ContractParameterDeclarationJSON {
  readonly type: 'Integer';
  readonly value: string;
}

export interface InteropInterfaceContractParameterJSON extends ContractParameterDeclarationJSON {
  readonly type: 'InteropInterface';
}

export interface MapContractParameterJSON extends ContractParameterDeclarationJSON {
  readonly type: 'Map';
  readonly value: ReadonlyArray<readonly [ContractParameterJSON, ContractParameterJSON]>;
}

export interface PublicKeyContractParameterJSON extends ContractParameterDeclarationJSON {
  readonly type: 'PublicKey';
  readonly value: string;
}

export interface SignatureContractParameterJSON extends ContractParameterDeclarationJSON {
  readonly type: 'Signature';
  readonly value: string;
}

export interface StringContractParameterJSON extends ContractParameterDeclarationJSON {
  readonly type: 'String';
  readonly value: string;
}

export interface VoidContractParameterJSON extends ContractParameterDeclarationJSON {
  readonly type: 'Void';
}

export type ContractParameterJSON =
  | SignatureContractParameterJSON
  | BooleanContractParameterJSON
  | IntegerContractParameterJSON
  | Hash160ContractParameterJSON
  | Hash256ContractParameterJSON
  | ByteArrayContractParameterJSON
  | MapContractParameterJSON
  | PublicKeyContractParameterJSON
  | StringContractParameterJSON
  | ArrayContractParameterJSON
  | InteropInterfaceContractParameterJSON
  | VoidContractParameterJSON;

export type ContractParameterTypeJSON = keyof typeof ContractParameterTypeModel;
export type WitnessScopeJSON = keyof typeof WitnessScopeModel;

export interface InvocationResultErrorJSON {
  readonly state: 'FAULT';
  readonly gas_consumed: string;
  readonly stack: readonly ContractParameterJSON[];
  readonly script: string;
}

export interface InvocationResultSuccessJSON {
  readonly state: 'HALT';
  readonly gas_consumed: string;
  readonly stack: readonly ContractParameterJSON[];
  readonly script: string;
}

export type InvocationResultJSON = InvocationResultSuccessJSON | InvocationResultErrorJSON;

export interface StorageChangeAddJSON {
  readonly type: 'Add';
  readonly hash: string;
  readonly key: string;
  readonly value: string;
}

export interface StorageChangeModifyJSON {
  readonly type: 'Modify';
  readonly hash: string;
  readonly key: string;
  readonly value: string;
}

export interface StorageChangeDeleteJSON {
  readonly type: 'Delete';
  readonly hash: string;
  readonly key: string;
}

export type StorageChangeJSON = StorageChangeAddJSON | StorageChangeModifyJSON | StorageChangeDeleteJSON;

export interface ActionBaseJSON {
  readonly version: number;
  readonly index: string;
  readonly scriptHash: string;
}

export interface LogActionJSON extends ActionBaseJSON {
  readonly type: 'Log';
  readonly message: string;
}

export interface NotificationActionJSON extends ActionBaseJSON {
  readonly type: 'Notification';
  readonly args: readonly ContractParameterJSON[];
}

export type ActionJSON = NotificationActionJSON | LogActionJSON;
export type ActionTypeJSON = ActionJSON['type'];

export interface StorageItemJSON {
  readonly hash: string;
  readonly key: string;
  readonly value: string;
  readonly flags: StorageFlagsJSON;
}

export type StorageFlagsJSON = keyof typeof StorageFlagsModel;

export interface WitnessJSON {
  readonly invocation: string;
  readonly verification: string;
}

export interface CosignerJSON {
  readonly account: string;
  readonly scopes: WitnessScopeJSON;
  readonly allowedContracts?: readonly string[];
  readonly allowedGroups?: readonly string[];
}

export interface AttributeJSON {
  readonly usage: AttributeUsageJSON;
  readonly data: string;
}

export type AttributeUsageJSON = keyof typeof AttributeUsageModel;

export type RelayResultReasonJSON = keyof typeof RelayResultReasonModel;

// export interface InvocationDataJSON {
//   readonly result: InvocationResultJSON;
//   readonly asset?: AssetJSON;
//   readonly contracts: readonly ContractJSON[];
//   readonly deletedContractHashes: readonly string[];
//   readonly migratedContractHashes: ReadonlyArray<readonly [string, string]>;
//   readonly voteUpdates: ReadonlyArray<readonly [string, ReadonlyArray<string>]>;
//   readonly actions: readonly ActionJSON[];
//   readonly storageChanges: readonly StorageChangeJSON[];
// }

export interface TransactionJSON {
  readonly hash: string;
  readonly size: number;
  readonly version: number;
  readonly nonce: number;
  readonly sender: string;
  readonly sys_fee: string;
  readonly net_fee: string;
  readonly valid_until_block: number;
  readonly attributes: readonly AttributeJSON[];
  readonly cosigners: readonly CosignerJSON[];
  readonly script: string;
  readonly witnesses: readonly WitnessJSON[];
}

export interface StateDescriptorJSON {
  readonly type: StateDescriptorTypeJSON;
  readonly key: string;
  readonly field: string;
  readonly value: string;
}

export type StateDescriptorTypeJSON = keyof typeof StateDescriptorTypeModel;

export interface TransactionReceiptJSON {
  // readonly blockIndex: number;
  readonly blockHash: string;
  readonly blockTime: number;
  readonly transactionHash: string;
  readonly confirmations: number;
}

export interface ConfirmedTransactionJSON extends TransactionJSON, TransactionReceiptJSON {}

export type WildcardContainerJSON<T> = readonly T[] | '*';

export interface ContractMethodDescriptorJSON {
  readonly name: string;
  readonly parameters: readonly ContractParameterDeclarationJSON[];
  readonly returnType: ContractParameterTypeJSON;
}

export interface ContractEventJSON {
  readonly name: string;
  readonly parameters: readonly ContractParameterDeclarationJSON[];
}

export interface ContractAbiJSON {
  readonly hash: string;
  readonly entryPoint: ContractMethodDescriptorJSON;
  readonly methods: readonly ContractMethodDescriptorJSON[];
  readonly events: readonly ContractEventJSON[];
}

export interface ContractGroupJSON {
  readonly publicKey: string;
  readonly signature: string;
}

export type ContractPermissionDescriptorJSON = string | '*';

export interface ContractPermissionsJSON {
  readonly contract: ContractPermissionDescriptorJSON;
  readonly methods: WildcardContainerJSON<string>;
}

export interface ContractManifestJSON {
  readonly abi: ContractAbiJSON;
  readonly groups: readonly ContractGroupJSON[];
  readonly permissions: readonly ContractPermissionsJSON[];
  readonly trusts: WildcardContainerJSON<string>;
  readonly safeMethods: WildcardContainerJSON<string>;
  readonly features: {
    readonly storage: boolean;
    readonly payable: boolean;
  };
}

export interface ContractJSON {
  readonly hash: string;
  readonly script: string;
  readonly manifest: ContractManifestJSON;
}

export interface BlockBaseJSON {
  readonly hash: string;
  readonly size: number;
  readonly version: number;
  readonly previousblockhash: string;
  readonly merkleroot: string;
  readonly time: string;
  readonly index: number;
  readonly nextconsensus: string;
  readonly witnesses: readonly WitnessJSON[];
  readonly confirmations: number;
  readonly nextblockhash?: string;
}

export interface ConsensusDataJSON {
  readonly primary: number;
  readonly nonce: string;
}

export interface HeaderJSON extends BlockBaseJSON {}

export interface BlockJSON extends BlockBaseJSON {
  readonly tx: readonly ConfirmedTransactionJSON[];
  readonly consensus_data: ConsensusDataJSON;
}

export interface NetworkSettingsJSON {
  readonly issueGASFee: string;
}

export interface CallReceiptJSON {
  readonly result: InvocationResultJSON;
  readonly actions: readonly ActionJSON[];
}

export interface VerifyScriptResultJSON {
  readonly failureMessage?: string;
  readonly hash: string;
  readonly witness: WitnessJSON;
  readonly actions: readonly ActionJSON[];
}

export interface VerifyTransactionResultJSON {
  readonly verifications: readonly VerifyScriptResultJSON[];
}

export interface RelayTransactionResultJSON {
  readonly transaction: TransactionJSON;
  readonly verifyResult?: VerifyTransactionResultJSON;
}

export interface ValidatorJSON {
  readonly active: boolean;
  readonly publicKey: string;
  readonly votes: string;
}

export interface PluginJSON {
  readonly name: string;
  readonly version: string;
  readonly interfaces: readonly string[];
}

export interface VersionJSON {
  readonly tcpPort: number;
  readonly wsPort: number;
  readonly nonce: number;
  readonly useragent: string;
}
