type WalletState = {
  name: string;
  accounts: string[];
  selectedAccount: number;
  lockState: "locked" | "unlocked";
};

export default WalletState;
