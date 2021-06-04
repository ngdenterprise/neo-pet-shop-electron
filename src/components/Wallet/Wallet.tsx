import React, { useState } from "react";

import AccountNameForm from "./AccountNameForm";
import AccountSelector from "./AccountSelector";
import Icon from "./Icon";
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
  const [showNewAccountForm, setShowNewAccountForm] = useState(false);
  const [showNewWalletForm, setShowNewWalletForm] = useState(false);
  return (
    <>
      {!!walletState && (
        <div style={{ paddingTop: 15 }}>
          <span
            style={{
              backgroundColor: "mediumaquamarine",
              borderRadius: "10px 10px 0 0",
              fontWeight: "bold",
              marginLeft: 25,
              padding: "10px 30px 10px 30px",
            }}
          >
            {!!walletState && (
              <>
                <span style={{ marginRight: 15 }}>{walletState.name}:</span>
                <AccountSelector
                  accounts={walletState.accounts}
                  selectedAccount={walletState.selectedAccount}
                  selectAccount={selectAccount}
                />
              </>
            )}
          </span>
        </div>
      )}
      <div
        style={{
          backgroundColor: "mediumaquamarine",
          padding: 10,
        }}
      >
        {!!walletState && (
          <div
            style={{
              alignItems: "center",
              display: "grid",
              columnGap: 5,
              gridTemplate: `"avatar address action1 action2" auto "avatar balance action1 action2" auto / 1fr 5fr auto auto`,
              textAlign: "center",
            }}
          >
            <div style={{ gridArea: "avatar" }}>
              <Icon emoji="🧑‍🚀" />
              <br />
              <strong>
                {walletState.accounts[walletState.selectedAccount]}
              </strong>
            </div>
            <div style={{ fontWeight: "bold", gridArea: "address" }}>
              {walletState.receiveAddress}
            </div>
            <div style={{ gridArea: "balance" }}>
              {(parseInt(walletState.gasBalance) / 100000000).toFixed(2)} GAS
            </div>
            <button
              style={{ gridArea: "action2" }}
              onClick={() => setShowNewAccountForm(true)}
            >
              <Icon emoji="➕" />
              <br />
              Add account
            </button>
            <button style={{ gridArea: "action1" }} onClick={closeWallet}>
              <Icon emoji="❌" />
              <br />
              Close wallet
            </button>
          </div>
        )}
        {!walletState && (
          <div
            style={{
              alignItems: "center",
              display: "grid",
              columnGap: 5,
              gridTemplate: `"text action1 action2" auto / 1fr auto auto`,
              textAlign: "center",
            }}
          >
            <span style={{ gridArea: "text" }}>
              You need to open your wallet (or create a new wallet) before you
              can adopt and feed pets.
            </span>
            <button
              style={{ gridArea: "action1" }}
              onClick={() => setShowNewWalletForm(true)}
            >
              <Icon emoji="📃" />
              <br />
              New wallet
            </button>
            <button style={{ gridArea: "action2" }} onClick={openWallet}>
              <Icon emoji="📂" />
              <br />
              Open wallet
            </button>
          </div>
        )}
        {showNewAccountForm && (
          <AccountNameForm
            newAccount={newAccount}
            onClose={() => setShowNewAccountForm(false)}
          />
        )}
        {showNewWalletForm && (
          <NewWalletForm
            newWallet={newWallet}
            onClose={() => setShowNewWalletForm(false)}
          />
        )}
        {walletState?.lockState === "locked" && (
          <WalletPasswordForm
            unlockWallet={unlockWallet}
            onCancel={closeWallet}
          />
        )}
      </div>
    </>
  );
}
