import React, { useState } from "react";

import Dialog from "../Dialog";
import Icon from "./Icon";
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
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const onSubmit = async () => {
    if (!!name && !!password1 && password1 === password2) {
      await newWallet(name, password1);
      onClose();
    }
  };
  return (
    <Dialog defaultAction={onSubmit}>
      <LabeledInput
        autoFocus
        label="Enter a name for your new wallet"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <LabeledInput
        label="Choose a password for your wallet"
        type="password"
        value={password1}
        onChange={(e) => setPassword1(e.target.value)}
      />
      <LabeledInput
        label="Re-enter the password for confirmation"
        type="password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />
      <div>
        <button
          disabled={!name || !password1 || password1 !== password2}
          onClick={onSubmit}
        >
          <Icon emoji="💾" />
          <br />
          Save wallet
        </button>
      </div>
      <div>
        <button onClick={onClose}>Cancel</button>
      </div>
    </Dialog>
  );
}
