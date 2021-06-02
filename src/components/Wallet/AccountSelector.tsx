import React from "react";

type Props = {
  accounts: string[];
  selectedAccount: number;
  selectAccount: (i: number) => Promise<void>;
};

/**
 * Allows a user to select between the various accounts in a wallet
 */
export default function AccountSelector({
  accounts,
  selectedAccount,
  selectAccount,
}: Props) {
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
    </>
  );
}
