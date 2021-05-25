import React from "react";

import CenterInScreen from "./CenterInScreen";

type Props = {
  children: any;
};

/**
 * Displays arbitary content stacked in a modal dialog
 */
export default function NewWalletForm({ children }: Props) {
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.5)",
        bottom: 0,
        left: 0,
        position: "fixed",
        right: 0,
        top: 0,
      }}
    >
      <CenterInScreen>
        <div
          style={{
            alignItems: "stretch",
            backgroundColor: "#fff",
            border: "1px solid #000",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            minHeight: "min(400px, 80vh)",
            minWidth: "min(400px, 80vw)",
            padding: 10,
            textAlign: "center",
          }}
        >
          {children}
        </div>
      </CenterInScreen>
    </div>
  );
}
