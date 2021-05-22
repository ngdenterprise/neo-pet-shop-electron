import * as neonCore from "@cityofzion/neon-core";

import BlockchainMonitor from "./BlockchainMonitor";
import PetShopContract from "./PetShopContract";

const postMessageToFrame = (message: any) => {
  console.log("[server] ->", message);
  document.querySelector("iframe")?.contentWindow?.postMessage(message, "*");
};

window.addEventListener("load", () => {
  window.addEventListener("message", (m) => {
    console.log("[server] <-", m.data);
    // TODO ...
  });
});

const rpcClient = new neonCore.rpc.RPCClient("http://seed4t.neo.org:20332");

const contract = new PetShopContract(rpcClient);

new BlockchainMonitor(rpcClient, async () => {
  const contractState = await contract.getContractState();
  postMessageToFrame({ contractState });
});
