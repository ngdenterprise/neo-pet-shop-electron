import * as neonCore from "@cityofzion/neon-core";

import ContractState from "../src-shared/ContractState";

const TESTNET_CONTRACT_HASH = "bac8fe4db61f69bde42c85a880ebb31f1fcfd1ba";
const PRIVATENET_CONTRACT_HASH = "9c6cc77576574a6227612e920533a61af798f265";

const reverseHexString = (hexString: string) =>
  hexString
    .match(/[a-fA-F0-9]{2}/g)
    ?.reverse()
    .join("");

const CONTRACT_HASH =
  //"0x" + reverseHexString(TESTNET_CONTRACT_HASH);
  "0x" + reverseHexString(PRIVATENET_CONTRACT_HASH);

const decodeAddress = (base64EncodedAddress?: string) => {
  if (!base64EncodedAddress) {
    return undefined;
  }
  const scriptHash = neonCore.u.str2hexstring(atob(base64EncodedAddress));
  if (scriptHash === "0000000000000000000000000000000000000000") {
    return undefined;
  }
  return neonCore.wallet.getAddressFromScriptHash(scriptHash);
};

export default class PetShopContract {
  constructor(private readonly rpcClient: neonCore.rpc.RPCClient) {}

  async getContractState(): Promise<ContractState> {
    const updatedContractState: ContractState = { pets: [] };
    const result = await this.rpcClient.invokeFunction(
      CONTRACT_HASH,
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
      const lastFed = new Date((pet[1] || 0) * 1000);
      updatedContractState.pets[petId] = { petId, isHungry, owner, lastFed };
    }
    return updatedContractState;
  }
}
