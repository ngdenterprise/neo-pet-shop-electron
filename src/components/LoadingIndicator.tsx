import React from "react";

type Props = {
  pendingTxs: string[];
};

/**
 * Provides a visual hint that a transaction was recently submitted but has
 * not yet been confirmed.
 */
export default function LoadingIndicator({ pendingTxs }: Props) {
  if (pendingTxs.length === 0) {
    return <></>;
  }
  return (
    <div
      style={{
        backgroundColor: "blueviolet",
        bottom: 10,
        color: "whitesmoke",
        fontWeight: "bold",
        padding: 5,
        position: "fixed",
        right: 10,
      }}
    >
      Awaiting confirmation&hellip;
    </div>
  );
}
