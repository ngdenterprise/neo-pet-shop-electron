import React, { useState } from "react";

import CenterInScreen from "../CenterInScreen";
import LabeledInput from "../LabeledInput";

type Props = {
  newWallet: (name: string, password: string) => Promise<void>;
  onClose: () => void;
};

/**
 * Prompts the user for the inputs required to create a new wallet.
 */
export default function NewWalletForm({ newWallet, onClose }: Props) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.5)",
        bottom: 0,
        left: 0,
        position: "fixed",
        right: 0,
        top: 0,
      }}
    >
      <CenterInScreen>
        <div
          style={{
            alignItems: "stretch",
            backgroundColor: "#fff",
            border: "1px solid #000",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            minHeight: "min(400px, 80vh)",
            minWidth: "min(400px, 80vw)",
            padding: 10,
            textAlign: "center",
          }}
        >
          <LabeledInput
            label="Enter a name for your new wallet"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <LabeledInput
            label="Choose a password for your wallet"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button
              disabled={!name || !password}
              onClick={async () => {
                await newWallet(name, password);
                onClose();
              }}
            >
              Save wallet
            </button>
          </div>
          <div>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </CenterInScreen>
    </div>
  );
}
