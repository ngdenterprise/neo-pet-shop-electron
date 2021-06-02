type WalletState = {
  name: string;
  accounts: string[];
  gasBalance: string;
  receiveAddress: string;
  selectedAccount: number;
  lockState: "locked" | "unlocked";
};

export default WalletState;
