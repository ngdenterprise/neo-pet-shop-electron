import * as fs from "fs";
import * as neonCore from "@cityofzion/neon-core";

import WalletState from "../src-shared/WalletState";

type LockState = "locked" | "unlocked";

type State = {
  wallet: neonCore.wallet.Wallet;
  selectedAccount: number;
  lockState: LockState;
  password: string | null;
  path: string;
};

export default class Wallet {
  private state: State | null = null;

  constructor(private readonly rpcClient: neonCore.rpc.RPCClient) {}

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

  getAccount() {
    return this.state?.wallet.accounts[this.state.selectedAccount] || undefined;
  }

  async getWalletState(): Promise<WalletState | null> {
    if (!this.state) {
      return null;
    }
    const selectedAccount = Math.max(
      0,
      Math.min(
        this.state.wallet.accounts.length - 1,
        this.state.selectedAccount
      )
    );
    const receiveAddress = this.state.wallet.accounts[selectedAccount].address;
    const balances = await this.rpcClient.getNep17Balances(receiveAddress);
    const gasBalance =
      balances.balance.find(
        (_) =>
          _.assethash === `0x${neonCore.CONST.NATIVE_CONTRACT_HASH.GasToken}`
      )?.amount || "0";
    return {
      accounts: this.state.wallet.accounts.map((_) => _.label),
      gasBalance,
      name: this.state.wallet.name,
      receiveAddress,
      selectedAccount,
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
    try {
      await this.unlock("");
    } catch (e) {
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
    const results = await this.state.wallet.decryptAll(password);
    if (results.indexOf(false) !== -1) {
      this.state.lockState = "locked";
      this.state.password = null;
      throw new Error("Wrong password");
    } else {
      this.state.lockState = "unlocked";
      this.state.password = password;
    }
  }
}
