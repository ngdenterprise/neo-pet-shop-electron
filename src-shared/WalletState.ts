type WalletState = {
  name: string;
  accounts: string[];
  gasBalance: string;
  selectedAccount: number;
  lockState: "locked" | "unlocked";
};

export default WalletState;
