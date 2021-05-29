import React, { useState } from "react";

import Dialog from "../Dialog";
import LabeledInput from "../LabeledInput";

type Props = {
  unlockWallet: (password: string) => Promise<void>;
  onCancel: () => void;
};

/**
 * Prompts the user for their wallet password
 */
export default function WalletPasswordForm({ unlockWallet, onCancel }: Props) {
  const [password, setPassword] = useState("");
  return (
    <Dialog defaultAction={() => unlockWallet(password)}>
      <LabeledInput
        autoFocus
        label="Enter the password for your wallet"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <button onClick={() => unlockWallet(password)}>Unlock wallet</button>
      </div>
      <div>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </Dialog>
  );
}
