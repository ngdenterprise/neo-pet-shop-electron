import React, { useState } from "react";

import NewWalletForm from "./NewWalletForm";
import WalletPasswordForm from "./WalletPasswordForm";
import WalletState from "../../../src-shared/WalletState";

type Props = {
  walletState: WalletState | null;
  closeWallet: () => Promise<void>;
  newWallet: (name: string, password: string) => Promise<void>;
  openWallet: () => Promise<void>;
  unlockWallet: (password: string) => Promise<void>;
};

/**
 * Renders information about the currently opened wallet
 */
export default function Wallet({
  walletState,
  closeWallet,
  newWallet,
  openWallet,
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
      {JSON.stringify(walletState)}
      {!walletState && (
        <>
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
