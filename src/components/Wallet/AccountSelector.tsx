import React, { useState } from "react";

import AccountNameForm from "./AccountNameForm";

type Props = {
  accounts: string[];
  selectedAccount: number;
  newAccount: (name: string) => Promise<void>;
  selectAccount: (i: number) => Promise<void>;
};

/**
 * Allows a user to select between the various accounts in a wallet
 */
export default function AccountSelector({
  accounts,
  selectedAccount,
  newAccount,
  selectAccount,
}: Props) {
  const [showNewAccountForm, setShowNewAccountForm] = useState(false);
  return (
    <>
      <select
        defaultValue={selectedAccount}
        onChange={(e) => selectAccount(e.target.selectedIndex)}
      >
        {accounts.map((name, i) => (
          <option key={i}>{name}</option>
        ))}
      </select>
      <button onClick={() => setShowNewAccountForm(true)}>Add account</button>
      {showNewAccountForm && (
        <AccountNameForm
          newAccount={newAccount}
          onClose={() => setShowNewAccountForm(false)}
        />
      )}
    </>
  );
}
