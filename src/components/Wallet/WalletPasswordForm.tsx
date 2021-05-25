import React, { useState } from "react";

import Dialog from "../Dialog";
import LabeledInput from "../LabeledInput";

type Props = {
  unlockWallet: (password: string) => Promise<void>;
  onClose: () => void;
};

/**
 * Prompts the user for their wallet password
 */
export default function WalletPasswordForm({ unlockWallet, onClose }: Props) {
  const [password, setPassword] = useState("");
  return (
    <Dialog>
      <LabeledInput
        label="Enter the password for your wallet"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <button
          onClick={async () => {
            await unlockWallet(password);
            onClose();
          }}
        >
          Unlock wallet
        </button>
      </div>
      <div>
        <button onClick={onClose}>Cancel</button>
      </div>
    </Dialog>
  );
}
