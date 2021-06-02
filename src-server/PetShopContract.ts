import * as neonCore from "@cityofzion/neon-core";

import ContractState from "../src-shared/ContractState";
import reverseHexString from "./reverseHexString";

const decodeAddress = (base64EncodedAddress?: string) => {
  if (!base64EncodedAddress) {
    return undefined;
  }
  const scriptHash = reverseHexString(
    neonCore.u.str2hexstring(atob(base64EncodedAddress))
  );
  if (scriptHash === "0000000000000000000000000000000000000000") {
    return undefined;
  }
  return neonCore.wallet.getAddressFromScriptHash(scriptHash);
};

export default class PetShopContract {
  constructor(
    private readonly rpcClient: neonCore.rpc.RPCClient,
    private readonly contractHash: string,
    private readonly networkMagic: number
  ) {}

  adopt(petId: number, account: neonCore.wallet.Account) {
    return this.sendTransaction("adoptPet", account, [
      neonCore.sc.ContractParam.integer(petId),
    ]);
  }

  feed(petId: number, account: neonCore.wallet.Account) {
    return this.sendTransaction("feed", account, [
      neonCore.sc.ContractParam.integer(petId),
    ]);
  }

  async getContractState(): Promise<ContractState> {
    const updatedContractState: ContractState = { pets: [] };
    const result = await this.rpcClient.invokeFunction(
      this.contractHash,
      "getAllStateJson"
    );
    let allStateJson = [];
    try {
      allStateJson = JSON.parse(atob(`${result.stack[0]?.value || ""}`));
    } catch (e) {
      console.warn("getAllStateJson parse error", e.message, result);
    }
    if (!Array.isArray(allStateJson)) {
      throw new Error("getAllStateJson did not return an array");
    }
    const pets = allStateJson[0];
    if (!Array.isArray(pets)) {
      throw new Error("getAllStateJson did not return pets array");
    }
    for (let petId = 0; petId < pets.length; petId++) {
      const pet = pets[petId];
      const isHungry = !!pet[2];
      const owner = decodeAddress(pet[0]);
      const lastFed = new Date(pet[1] || 0);
      updatedContractState.pets[petId] = { petId, isHungry, owner, lastFed };
    }
    return updatedContractState;
  }

  private async sendTransaction(
    operation: string,
    account: neonCore.wallet.Account,
    args: neonCore.sc.ContractParam[]
  ) {
    // TODO: Add a confirmation flow so the user sees how much GAS they are about to
    //       spend before the tx is actually submitted.
    const script = neonCore.sc.createScript({
      scriptHash: this.contractHash,
      operation,
      args,
    });
    const currentHeight = await this.rpcClient.getBlockCount();
    const transaction = new neonCore.tx.Transaction({
      validUntilBlock:
        currentHeight + neonCore.tx.Transaction.MAX_TRANSACTION_LIFESPAN - 1,
      systemFee: 0,
      script,
      signers: [{ account: account.scriptHash, scopes: "CalledByEntry" }],
    });
    await this.setNetworkFee(transaction);
    await this.setSystemFee(transaction);
    const signedTransaction = transaction.sign(
      account.privateKey,
      this.networkMagic
    );
    const txid = await this.rpcClient.sendRawTransaction(signedTransaction);
    console.log(`TXID ${txid} (${operation}) submitted`);
    return txid;
  }

  private async setNetworkFee(transaction: neonCore.tx.Transaction) {
    const feePerByteInvokeResponse = await this.rpcClient.invokeFunction(
      neonCore.CONST.NATIVE_CONTRACT_HASH.PolicyContract,
      "getFeePerByte"
    );
    if (feePerByteInvokeResponse.state !== "HALT") {
      console.warn("Could not invoke getFeePerByte, assuming zero network fee");
      transaction.networkFee = neonCore.u.BigInteger.fromNumber(0);
    } else {
      const feePerByte = neonCore.u.BigInteger.fromNumber(
        `${feePerByteInvokeResponse.stack[0].value}`
      );
      // Witness size and processing fee is hard-coded, see:
      // https://dojo.coz.io/neo3/neon-js/docs/guides/basic/transfer
      const transactionByteSize = transaction.serialize().length / 2 + 109;
      const witnessProcessingFee = neonCore.u.BigInteger.fromNumber(1000390);
      transaction.networkFee = feePerByte
        .mul(transactionByteSize)
        .add(witnessProcessingFee);
    }
  }

  private async setSystemFee(transaction: neonCore.tx.Transaction) {
    const invokeScriptResult = await this.rpcClient.invokeScript(
      transaction.script,
      transaction.signers
    );
    if (invokeScriptResult.state !== "HALT") {
      throw new Error(
        `invokeScript failed: ${JSON.stringify(invokeScriptResult)}`
      );
    }
    transaction.systemFee = neonCore.u.BigInteger.fromNumber(
      invokeScriptResult.gasconsumed
    );
  }
}
