import React, { useEffect, useState } from "react";

import ContractState from "../../../src-shared/ContractState";
import PetShop from "../PetShop/PetShop";
import SplashScreen from "./SplashScreen";

/**
 * This component handles communication with code that runs in the
 * Electron process.
 */
export default function Dapp() {
  const [contractState, setContractState] =
    useState<ContractState | null>(null);

  useEffect(() => {
    window.parent.postMessage({}, "file://");
    window.addEventListener("message", (e) => {
      const message = e.data;
      console.log("[client] <-", message);
      if (message.contractState) {
        setContractState(message.contractState);
      }
    });
  }, []);

  const adopt = async (petId: number) => {
    // TODO
  };

  const feed = async (petId: number) => {
    // TODO
  };

  if (!contractState) {
    return <SplashScreen />;
  } else {
    return <PetShop contractState={contractState} adopt={adopt} feed={feed} />;
  }
}
