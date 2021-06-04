import * as electron from "electron";
import * as neonCore from "@cityofzion/neon-core";

import BlockchainMonitor from "./BlockchainMonitor";
import BlockchainParameters from "./BlockchainParameters";
import PetShopContract from "./PetShopContract";
import Wallet from "./Wallet";

const TESTNET: BlockchainParameters = {
  rpcUrl: "http://seed3t.neo.org:20332",
  contractHash: "0xbad1cf1f1fb3eb80a8852ce4bd691fb64dfec8ba",
  magic: neonCore.CONST.MAGIC_NUMBER.TestNet,
};

const PRIVATENET: BlockchainParameters = {
  rpcUrl: "http://127.0.0.1:50012",
  contractHash: "0xfb1bdf761a98c0127a55740076d755d222d14f7f",
  magic: 3345620479,
};

const blockchainParameters = TESTNET;
// const blockchainParameters = PRIVATENET;

const postMessageToFrame = (message: any) => {
  console.log("[server] ->", message);
  document.querySelector("iframe")?.contentWindow?.postMessage(message, "*");
};

const getOpenPath = () => {
  return electron.ipcRenderer.sendSync("get-open-path") as string[] | undefined;
};

const getSavePath = () => {
  return electron.ipcRenderer.sendSync("get-save-path") as string | undefined;
};

const rpcClient = new neonCore.rpc.RPCClient(blockchainParameters.rpcUrl);

const wallet = new Wallet(rpcClient);

const contract = new PetShopContract(
  rpcClient,
  blockchainParameters.contractHash,
  blockchainParameters.magic
);

let pendingTxs: string[] = [];
new BlockchainMonitor(rpcClient, async () => {
  const newPendingTxs: string[] = [];
  for (const pendingTx of pendingTxs) {
    try {
      if (!(await rpcClient.getRawTransaction(pendingTx))) {
        newPendingTxs.push(pendingTx);
      }
    } catch (e) {
      console.warn(`Waiting for tx ${pendingTx} to confirm: ${e.message}`);
      newPendingTxs.push(pendingTx);
    }
  }
  pendingTxs = newPendingTxs;
  const contractState = await contract.getContractState();
  postMessageToFrame({
    contractState,
    pendingTxs,
    walletState: await wallet.getWalletState(),
  });
});

window.addEventListener("load", () => {
  window.addEventListener("message", async (e) => {
    const message = e.data;
    console.log("[server] <-", message);

    try {
      if (message.adopt?.petId !== undefined) {
        const account = wallet.getAccount();
        if (account) {
          postMessageToFrame({ loading: true });
          pendingTxs.push(await contract.adopt(message.adopt?.petId, account));
          postMessageToFrame({ loading: false, pendingTxs });
        }
      }

      if (message.closeWallet) {
        wallet.close();
        postMessageToFrame({ walletState: await wallet.getWalletState() });
      }

      if (message.feed?.petId !== undefined) {
        const account = wallet.getAccount();
        if (account) {
          postMessageToFrame({ loading: true });
          pendingTxs.push(await contract.feed(message.feed?.petId, account));
          postMessageToFrame({ loading: false, pendingTxs });
        }
      }

      if (message.newAccount?.name) {
        postMessageToFrame({ loading: true });
        await wallet.newAccount(message.newAccount.name);
        postMessageToFrame({
          loading: false,
          walletState: await wallet.getWalletState(),
        });
      }

      if (message.newWallet?.name && message.newWallet?.password) {
        const path = getSavePath();
        if (path) {
          postMessageToFrame({ loading: true });
          await wallet.createNew(
            message.newWallet.name,
            message.newWallet.password,
            path
          );
          postMessageToFrame({
            loading: false,
            walletState: await wallet.getWalletState(),
          });
        }
      }

      if (message.openWallet) {
        const path = getOpenPath();
        if (path && path[0]) {
          postMessageToFrame({ loading: true });
          await wallet.open(path[0]);
          postMessageToFrame({
            loading: false,
            walletState: await wallet.getWalletState(),
          });
        }
      }

      if (message.selectAccount?.i !== undefined) {
        wallet.selectAccount(message.selectAccount.i);
        postMessageToFrame({ walletState: await wallet.getWalletState() });
      }

      if (message.unlockWallet?.password !== undefined) {
        postMessageToFrame({ loading: true });
        await wallet.unlock(message.unlockWallet.password);
        postMessageToFrame({
          loading: false,
          walletState: await wallet.getWalletState(),
        });
      }
    } catch (e) {
      console.error("Sending error to UI", e);
      postMessageToFrame({ error: e.message || `${e}`, loading: false });
    }
  });
});
