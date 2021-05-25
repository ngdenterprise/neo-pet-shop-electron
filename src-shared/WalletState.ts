type WalletState = {
  name: string;
  accounts: string[];
  selectedAccount: number;
  lockState: "locked" | "unlocked" | "error";
};

export default WalletState;
