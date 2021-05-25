import * as fs from "fs";
import * as neonCore from "@cityofzion/neon-core";

import WalletState from "../src-shared/WalletState";

type State = {
  wallet: neonCore.wallet.Wallet;
  selectedAccount: number;
  lockState: "locked" | "unlocked" | "error";
  password: string | null;
  path: string;
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
    this.state = {
      wallet,
      selectedAccount: 0,
      lockState: "unlocked",
      password,
      path,
    };
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

  async newAccount(name: string) {
    if (!this.state || this.state.password === null) {
      return null;
    }
    const account = new neonCore.wallet.Account(
      neonCore.wallet.generatePrivateKey()
    );
    account.label = name;
    this.state.wallet.addAccount(account);
    this.state.selectedAccount = this.state.wallet.accounts.length - 1;
    await this.state.wallet.encryptAll(this.state.password);
    const walletJson = JSON.stringify(this.state.wallet.export());
    await fs.promises.writeFile(this.state.path, walletJson);
    await this.state.wallet.decryptAll(this.state.password);
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
    this.state = {
      wallet,
      selectedAccount: 0,
      lockState: "locked",
      password: null,
      path,
    };
    // Attempt to unlock with an empty password:
    await this.unlock("");
    if (this.state.lockState === "error") {
      this.state.lockState = "locked";
    }
  }

  selectAccount(i: number) {
    if (!this.state) {
      return;
    }
    this.state.selectedAccount = Math.max(
      0,
      Math.min(this.state.wallet.accounts.length - 1, i)
    );
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
        this.state.password = null;
        return;
      }
    }
    this.state.lockState = "unlocked";
    this.state.password = password;
  }
}
