import React, { useEffect, useState } from "react";

import ContractState from "../../../src-shared/ContractState";
import ErrorDisplay from "../ErrorDisplay";
import Instructions from "../PetShop/Instructions";
import LoadingIndicator from "../LoadingIndicator";
import PetShop from "../PetShop/PetShop";
import SplashScreen from "../PetShop/SplashScreen";
import Wallet from "../Wallet/Wallet";
import WalletState from "../../../src-shared/WalletState";

const TARGET_ORIGIN = "file://";

/**
 * This component handles communication with code that runs in the
 * Electron process.
 */
export default function Dapp() {
  const [contractState, setContractState] =
    useState<ContractState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingTxs, setPendingTxs] = useState<string[]>([]);
  const [walletState, setWalletState] = useState<WalletState | null>(null);

  useEffect(() => {
    window.parent.postMessage({}, TARGET_ORIGIN);
    window.addEventListener("message", (e) => {
      const message = e.data;
      console.log("[client] <-", message);
      if (message.contractState !== undefined) {
        setContractState(message.contractState);
      }
      if (message.error !== undefined) {
        setError(message.error);
      }
      if (message.loading !== undefined) {
        setLoading(message.loading);
      }
      if (message.pendingTxs !== undefined) {
        setPendingTxs(message.pendingTxs);
      }
      if (message.walletState !== undefined) {
        setWalletState(message.walletState);
      }
    });
  }, []);

  const adopt = async (petId: number) => {
    window.parent.postMessage({ adopt: { petId } }, TARGET_ORIGIN);
  };

  const closeWallet = async () => {
    window.parent.postMessage({ closeWallet: true }, TARGET_ORIGIN);
  };

  const feed = async (petId: number) => {
    window.parent.postMessage({ feed: { petId } }, TARGET_ORIGIN);
  };

  const newAccount = async (name: string) => {
    window.parent.postMessage({ newAccount: { name } }, TARGET_ORIGIN);
  };

  const newWallet = async (name: string, password: string) => {
    window.parent.postMessage({ newWallet: { name, password } }, TARGET_ORIGIN);
  };

  const openWallet = async () => {
    window.parent.postMessage({ openWallet: true }, TARGET_ORIGIN);
  };

  const selectAccount = async (i: number) => {
    window.parent.postMessage({ selectAccount: { i } }, TARGET_ORIGIN);
  };

  const unlockWallet = async (password: string) => {
    window.parent.postMessage({ unlockWallet: { password } }, TARGET_ORIGIN);
  };

  if (!contractState) {
    return <SplashScreen />;
  } else {
    return (
      <>
        <div
          style={{
            bottom: 0,
            display: "grid",
            fontFamily: "sans-serif",
            gridTemplateColumns: "auto",
            gridTemplateRows: "auto 1fr auto",
            left: 0,
            position: "fixed",
            right: 0,
            top: 0,
          }}
        >
          <Instructions />
          <PetShop
            contractState={contractState}
            disabled={walletState?.lockState !== "unlocked"}
            adopt={adopt}
            feed={feed}
          />
          <Wallet
            walletState={walletState}
            closeWallet={closeWallet}
            newAccount={newAccount}
            newWallet={newWallet}
            openWallet={openWallet}
            selectAccount={selectAccount}
            unlockWallet={unlockWallet}
          />
        </div>
        <LoadingIndicator visible={pendingTxs.length > 0}>
          Awaiting confirmation&hellip;
        </LoadingIndicator>
        <LoadingIndicator visible={loading}>
          Please wait&hellip;
        </LoadingIndicator>
        <ErrorDisplay error={error} dismiss={() => setError(null)} />
      </>
    );
  }
}
