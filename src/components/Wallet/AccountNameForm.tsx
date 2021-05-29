import React, { useState } from "react";

import Dialog from "../Dialog";
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
  return (
    <Dialog>
      <LabeledInput
        autoFocus
        label="Enter a name for the new account"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <button
          onClick={async () => {
            await newAccount(name);
            onClose();
          }}
        >
          Create account
        </button>
      </div>
      <div>
        <button onClick={onClose}>Cancel</button>
      </div>
    </Dialog>
  );
}
