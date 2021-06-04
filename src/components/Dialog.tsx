import React from "react";

import CenterInScreen from "./CenterInScreen";

type Props = {
  children: any;
  defaultAction?: () => void;
};

/**
 * Displays arbitary content stacked in a modal dialog
 */
export default function NewWalletForm({ children, defaultAction }: Props) {
  return (
    <div
      style={{
        backgroundColor: "rgba(100,100,100,0.75)",
        bottom: 0,
        left: 0,
        position: "fixed",
        right: 0,
        top: 0,
      }}
    >
      <CenterInScreen>
        <form
          style={{
            alignItems: "stretch",
            backgroundColor: "#fff",
            border: "5px solid mediumaquamarine",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            minHeight: "min(400px, 80vh)",
            minWidth: "min(400px, 80vw)",
            padding: 10,
            textAlign: "center",
          }}
          onSubmit={(e) => {
            if (defaultAction) {
              defaultAction();
            }
            e.preventDefault();
          }}
        >
          {children}
        </form>
      </CenterInScreen>
    </div>
  );
}
