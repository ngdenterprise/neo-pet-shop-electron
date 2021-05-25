import React, { useState } from "react";

import AccountSelector from "./AccountSelector";
import NewWalletForm from "./NewWalletForm";
import WalletPasswordForm from "./WalletPasswordForm";
import WalletState from "../../../src-shared/WalletState";

type Props = {
  walletState: WalletState | null;
  closeWallet: () => Promise<void>;
  newAccount: (name: string) => Promise<void>;
  newWallet: (name: string, password: string) => Promise<void>;
  openWallet: () => Promise<void>;
  selectAccount: (i: number) => Promise<void>;
  unlockWallet: (password: string) => Promise<void>;
};

/**
 * Renders information about the currently opened wallet
 */
export default function Wallet({
  walletState,
  closeWallet,
  newAccount,
  newWallet,
  openWallet,
  selectAccount,
  unlockWallet,
}: Props) {
  const [showNewWalletForm, setShowNewWalletForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  return (
    <div
      style={{
        backgroundColor: "lightgreen",
        bottom: 0,
        left: 0,
        padding: 10,
        position: "fixed",
        right: 0,
      }}
    >
      {!!walletState && (
        <>
          <strong>Wallet:</strong> {walletState.name} <strong>Account:</strong>{" "}
          <AccountSelector
            accounts={walletState.accounts}
            selectedAccount={walletState.selectedAccount}
            newAccount={
              walletState.lockState === "unlocked" ? newAccount : undefined
            }
            selectAccount={selectAccount}
          />
        </>
      )}
      {!walletState && (
        <>
          You need to open or create a wallet before you can adopt and feed
          pets.
          <button onClick={() => setShowNewWalletForm(true)}>New</button>
          <button onClick={openWallet}>Open</button>
        </>
      )}
      {!!walletState && walletState.lockState !== "unlocked" && (
        <>
          <button onClick={() => setShowPasswordForm(true)}>Unlock</button>
        </>
      )}
      {!!walletState && (
        <>
          <button onClick={closeWallet}>Close</button>
        </>
      )}
      {showNewWalletForm && (
        <NewWalletForm
          newWallet={newWallet}
          onClose={() => setShowNewWalletForm(false)}
        />
      )}
      {showPasswordForm && (
        <WalletPasswordForm
          unlockWallet={unlockWallet}
          onClose={() => setShowPasswordForm(false)}
        />
      )}
    </div>
  );
}
