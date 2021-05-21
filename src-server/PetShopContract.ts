import * as neonCore from "@cityofzion/neon-core";

const reverseHexString = (hexString: string) =>
  hexString
    .match(/[a-fA-F0-9]{2}/g)
    ?.reverse()
    .join("");

const CONTRACT_HASH =
  "0x" + reverseHexString("bac8fe4db61f69bde42c85a880ebb31f1fcfd1ba");

export default class PetShopContract {
  private readonly rpcClient: neonCore.rpc.RPCClient;

  constructor(rpcUrl: string) {
    this.rpcClient = new neonCore.rpc.RPCClient(rpcUrl);
    this.updateContractState();
  }

  private async updateContractState() {
    const result = await this.rpcClient.invokeFunction(
      CONTRACT_HASH,
      "getAllStateJson"
    );
    console.log("getAllStateJson", result);
  }
}
