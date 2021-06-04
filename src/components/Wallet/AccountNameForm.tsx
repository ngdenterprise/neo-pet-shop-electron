import React, { useState } from "react";

import Dialog from "../Dialog";
import Icon from "./Icon";
import LabeledInput from "../LabeledInput";

type Props = {
  newAccount: (name: string) => Promise<void>;
  onClose: () => void;
};

/**
 * Prompts the user for a new account name
 */
export default function AccountNameForm({ newAccount, onClose }: Props) {
  const [name, setName] = useState("");
  const onSubmit = async () => {
    await newAccount(name);
    onClose();
  };
  return (
    <Dialog defaultAction={onSubmit}>
      <LabeledInput
        autoFocus
        label="Enter a name for the new account"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <button onClick={onSubmit}>
          <Icon emoji="💾" />
          <br />
          Create account
        </button>
      </div>
      <div>
        <button onClick={onClose}>Cancel</button>
      </div>
    </Dialog>
  );
}
