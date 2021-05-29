import React from "react";

type Props = {
  children: any;
  visible: boolean;
};

/**
 * Provides a visual hint that an operation is in progress.
 */
export default function LoadingIndicator({ children, visible }: Props) {
  if (!visible) {
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
      {children}
    </div>
  );
}
