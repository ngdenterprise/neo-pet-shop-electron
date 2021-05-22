import React, { useEffect, useState } from "react";

import ContractState from "../../../src-shared/ContractState";
import PetShop from "../PetShop/PetShop";
import SplashScreen from "./SplashScreen";
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
  const [walletState, setWalletState] = useState<WalletState | null>(null);

  useEffect(() => {
    window.parent.postMessage({}, TARGET_ORIGIN);
    window.addEventListener("message", (e) => {
      const message = e.data;
      console.log("[client] <-", message);
      if (message.contractState) {
        setContractState(message.contractState);
      }
      if (message.walletState) {
        setWalletState(message.walletState);
      }
    });
  }, []);

  const adopt = async (petId: number) => {
    // TODO
  };

  const feed = async (petId: number) => {
    // TODO
  };

  const newWallet = async (name: string, password: string) => {
    window.parent.postMessage({ newWallet: { name, password } }, TARGET_ORIGIN);
  };

  const openWallet = async () => {
    // TODO
  };

  if (!contractState) {
    return <SplashScreen />;
  } else {
    return (
      <>
        <PetShop contractState={contractState} adopt={adopt} feed={feed} />
        <Wallet
          walletState={walletState}
          newWallet={newWallet}
          openWallet={openWallet}
        />
      </>
    );
  }
}
