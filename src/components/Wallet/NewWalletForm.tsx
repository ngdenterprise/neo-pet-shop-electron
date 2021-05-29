import React, { useState } from "react";

import Dialog from "../Dialog";
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
  const onSubmit = async () => {
    if (!!name && !!password) {
      await newWallet(name, password);
      onClose();
    }
  };
  return (
    <Dialog defaultAction={onSubmit}>
      <LabeledInput
        autoFocus
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
        <button disabled={!name || !password} onClick={onSubmit}>
          Save wallet
        </button>
      </div>
      <div>
        <button onClick={onClose}>Cancel</button>
      </div>
    </Dialog>
  );
}
