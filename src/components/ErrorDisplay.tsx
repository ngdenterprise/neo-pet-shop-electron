import React from "react";

import Dialog from "./Dialog";

type Props = {
  error: string | null;
  dismiss: () => void;
};

/**
 * Displays an error message that the user must dismiss to continue.
 */
export default function ErrorDisplay({ error, dismiss }: Props) {
  if (!error) {
    return <></>;
  }
  return (
    <Dialog>
      <p>
        <strong>Error:</strong>
      </p>
      <p style={{ color: "red" }}>{error}</p>
      <p>
        <button onClick={dismiss}>OK</button>
      </p>
    </Dialog>
  );
}
