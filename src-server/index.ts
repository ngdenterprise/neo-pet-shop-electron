import * as electron from "electron";
import * as neonCore from "@cityofzion/neon-core";

import BlockchainMonitor from "./BlockchainMonitor";
import PetShopContract from "./PetShopContract";
import Wallet from "./Wallet";

const postMessageToFrame = (message: any) => {
  console.log("[server] ->", message);
  document.querySelector("iframe")?.contentWindow?.postMessage(message, "*");
};

const wallet = new Wallet();

const getSavePath = () => {
  return electron.ipcRenderer.sendSync("get-save-path") as string | undefined;
};

window.addEventListener("load", () => {
  window.addEventListener("message", async (e) => {
    const message = e.data;
    console.log("[server] <-", message);
    if (
      message.newWallet &&
      message.newWallet.name &&
      message.newWallet.password
    ) {
      const path = getSavePath();
      if (!path) {
        return;
      }
      await wallet.createNew(
        message.newWallet.name,
        message.newWallet.password,
        path
      );
      const walletState = wallet.getWalletState();
      postMessageToFrame({ walletState });
    }
  });
});

const rpcClient = new neonCore.rpc.RPCClient("http://seed4t.neo.org:20332");

const contract = new PetShopContract(rpcClient);

new BlockchainMonitor(rpcClient, async () => {
  const contractState = await contract.getContractState();
  postMessageToFrame({ contractState });
});
