import * as electron from "electron";
import * as neonCore from "@cityofzion/neon-core";

import BlockchainMonitor from "./BlockchainMonitor";
import BlockchainParameters from "./BlockchainParameters";
import PetShopContract from "./PetShopContract";
import Wallet from "./Wallet";

const reverseHexString = (hexString: string) =>
  hexString
    .match(/[a-fA-F0-9]{2}/g)
    ?.reverse()
    .join("");

const TESTNET: BlockchainParameters = {
  rpcUrl: "http://seed3t.neo.org:20332",
  contractHash:
    "0x" + reverseHexString("bac8fe4db61f69bde42c85a880ebb31f1fcfd1ba"),
  magic: neonCore.CONST.MAGIC_NUMBER.TestNet,
};

const PRIVATENET: BlockchainParameters = {
  rpcUrl: "http://127.0.0.1:50012",
  contractHash:
    "0x" + reverseHexString("9c6cc77576574a6227612e920533a61af798f265"),
  magic: neonCore.CONST.MAGIC_NUMBER.SoloNet,
};

const blockchainParameters = TESTNET;
// const blockchainParameters = PRIVATENET;

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

const rpcClient = new neonCore.rpc.RPCClient(blockchainParameters.rpcUrl);

const contract = new PetShopContract(
  rpcClient,
  blockchainParameters.contractHash,
  blockchainParameters.magic
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
