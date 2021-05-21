import * as neonCore from "@cityofzion/neon-core";

import ContractState from "../src-shared/ContractState";

const reverseHexString = (hexString: string) =>
  hexString
    .match(/[a-fA-F0-9]{2}/g)
    ?.reverse()
    .join("");

const CONTRACT_HASH =
  "0x" + reverseHexString("bac8fe4db61f69bde42c85a880ebb31f1fcfd1ba");
const REFRESH_INTERVAL = 5000;

export default class PetShopContract {
  private readonly rpcClient: neonCore.rpc.RPCClient;

  private lastKnownBlockHeight = 0;

  constructor(
    rpcUrl: string,
    private readonly onUpdateContractState: (state: ContractState) => void
  ) {
    this.rpcClient = new neonCore.rpc.RPCClient(rpcUrl);
    this.refreshLoop();
  }

  private async refreshLoop() {
    try {
      const blockHeight = await this.rpcClient.getBlockCount();
      if (blockHeight > this.lastKnownBlockHeight) {
        this.lastKnownBlockHeight = blockHeight;
        await this.onUpdateContractState(await this.getContractState());
      }
    } finally {
      setTimeout(() => this.refreshLoop(), REFRESH_INTERVAL);
    }
  }

  private async getContractState(): Promise<ContractState> {
    const updatedContractState: ContractState = { pets: [] };
    const result = await this.rpcClient.invokeFunction(
      CONTRACT_HASH,
      "getAllStateJson"
    );
    const allStateJson = JSON.parse(atob(`${result.stack[0]?.value || ""}`));
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
      const owner = pet[0] || undefined;
      const lastFed = new Date((pet[1] || 0) * 1000);
      updatedContractState.pets[petId] = { petId, isHungry, owner, lastFed };
    }
    return updatedContractState;
  }
}
