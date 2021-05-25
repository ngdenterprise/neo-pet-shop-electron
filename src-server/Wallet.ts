import * as fs from "fs";
import * as neonCore from "@cityofzion/neon-core";

import WalletState from "../src-shared/WalletState";

type State = {
  wallet: neonCore.wallet.Wallet;
  selectedAccount: number;
  lockState: "locked" | "unlocked" | "error";
};

export default class Wallet {
  private state: State | null = null;

  close() {
    this.state = null;
  }

  async createNew(walletName: string, password: string, path: string) {
    const account = new neonCore.wallet.Account(
      neonCore.wallet.generatePrivateKey()
    );
    account.label = walletName;
    const wallet = new neonCore.wallet.Wallet({ name: walletName });
    wallet.addAccount(account);
    wallet.setDefault(0);
    await wallet.encryptAll(password);
    const walletJson = JSON.stringify(wallet.export());
    await fs.promises.writeFile(path, walletJson);
    await wallet.decryptAll(password);
    this.state = { wallet, selectedAccount: 0, lockState: "unlocked" };
  }

  getWalletState(): WalletState | null {
    if (!this.state) {
      return null;
    }
    return {
      accounts: this.state.wallet.accounts.map((_) => _.label),
      name: this.state.wallet.name,
      selectedAccount: Math.max(
        0,
        Math.min(
          this.state.wallet.accounts.length - 1,
          this.state.selectedAccount
        )
      ),
      lockState: this.state.lockState,
    };
  }

  async open(path: string) {
    const walletJson = JSON.parse(
      (await fs.promises.readFile(path)).toString()
    );
    if (
      walletJson.name === undefined ||
      walletJson.version === undefined ||
      walletJson.scrypt === undefined ||
      walletJson.accounts === undefined
    ) {
      // Probably not a wallet
      return;
    }
    const wallet = new neonCore.wallet.Wallet(walletJson);
    this.state = { wallet, selectedAccount: 0, lockState: "locked" };
    // Attempt to unlock with an empty password:
    await this.unlock("");
    if (this.state.lockState === "error") {
      this.state.lockState = "locked";
    }
  }

  async unlock(password: string) {
    if (!this.state) {
      return;
    }
    for (const account of this.state.wallet.accounts) {
      try {
        await account.decrypt(password);
      } catch (e) {
        this.state.lockState = "error";
        return;
      }
    }
    this.state.lockState = "unlocked";
  }
}
