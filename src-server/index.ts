import * as electron from "electron";
import * as neonCore from "@cityofzion/neon-core";

import BlockchainMonitor from "./BlockchainMonitor";
import PetShopContract from "./PetShopContract";
import Wallet from "./Wallet";

const PRIVATENET = "http://127.0.0.1:50012";
const TESTNET = "http://seed3t.neo.org:20332";

const TESTNET_CONTRACT_HASH = "bac8fe4db61f69bde42c85a880ebb31f1fcfd1ba";
const PRIVATENET_CONTRACT_HASH = "9c6cc77576574a6227612e920533a61af798f265";

const reverseHexString = (hexString: string) =>
  hexString
    .match(/[a-fA-F0-9]{2}/g)
    ?.reverse()
    .join("");

const postMessageToFrame = (message: any) => {
  console.log("[server] ->", message);
  document.querySelector("iframe")?.contentWindow?.postMessage(message, "*");
};

const wallet = new Wallet();

const getOpenPath = () => {
  return electron.ipcRenderer.sendSync("get-open-path") as string[] | undefined;
};

const getSavePath = () => {
  return electron.ipcRenderer.sendSync("get-save-path") as string | undefined;
};

const rpcClient = new neonCore.rpc.RPCClient(PRIVATENET);

const contract = new PetShopContract(
  rpcClient,
  "0x" + reverseHexString(PRIVATENET_CONTRACT_HASH),
  neonCore.CONST.MAGIC_NUMBER.TestNet
);

window.addEventListener("load", () => {
  window.addEventListener("message", async (e) => {
    const message = e.data;
    console.log("[server] <-", message);

    if (message.adopt?.petId !== undefined) {
      const account = wallet.getAccount();
      if (account) {
        await contract.adopt(message.adopt?.petId, account);
      }
    }

    if (message.closeWallet) {
      wallet.close();
      postMessageToFrame({ walletState: wallet.getWalletState() });
    }

    if (message.newAccount?.name) {
      await wallet.newAccount(message.newAccount.name);
      postMessageToFrame({ walletState: wallet.getWalletState() });
    }

    if (message.newWallet?.name && message.newWallet?.password) {
      const path = getSavePath();
      if (path) {
        await wallet.createNew(
          message.newWallet.name,
          message.newWallet.password,
          path
        );
        postMessageToFrame({ walletState: wallet.getWalletState() });
      }
    }

    if (message.openWallet) {
      const path = getOpenPath();
      if (path && path[0]) {
        await wallet.open(path[0]);
        postMessageToFrame({ walletState: wallet.getWalletState() });
      }
    }

    if (message.selectAccount?.i !== undefined) {
      wallet.selectAccount(message.selectAccount.i);
      postMessageToFrame({ walletState: wallet.getWalletState() });
    }

    if (message.unlockWallet?.password !== undefined) {
      await wallet.unlock(message.unlockWallet.password);
      postMessageToFrame({ walletState: wallet.getWalletState() });
    }
  });
});

new BlockchainMonitor(rpcClient, async () => {
  const contractState = await contract.getContractState();
  postMessageToFrame({ contractState });
});
