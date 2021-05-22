import React from "react";

import WalletState from "../../../src-shared/WalletState";

type Props = {
  walletState: WalletState | null;
  newWallet: (name: string, password: string) => Promise<void>;
  openWallet: () => Promise<void>;
};

/**
 * Renders information about the currently opened wallet
 */
export default function Wallet({ walletState, newWallet, openWallet }: Props) {
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
      <button
        onClick={() => {
          // TODO: Get inputs from UI
          newWallet("My wallet", "password");
        }}
      >
        New
      </button>
      <button onClick={openWallet}>Open</button>
    </div>
  );
}
