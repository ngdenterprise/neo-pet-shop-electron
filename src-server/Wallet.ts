import * as fs from "fs";
import * as neonCore from "@cityofzion/neon-core";

import WalletState from "../src-shared/WalletState";

export default class Wallet {
  private wallet: neonCore.wallet.Wallet | null = null;
  private selectedAccount: number = 0;

  close() {
    this.wallet = null;
    this.selectedAccount = 0;
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
    this.wallet = wallet;
    this.selectedAccount = 0;
  }

  getWalletState(): WalletState | null {
    if (!this.wallet) {
      return null;
    }
    const result: WalletState = {
      accounts: this.wallet.accounts.map((_) => _.label),
      name: this.wallet.name,
      selectedAccount: this.selectedAccount,
    };
    if (result.selectedAccount >= result.accounts.length) {
      result.selectedAccount = 0;
    }
    return result;
  }
}
