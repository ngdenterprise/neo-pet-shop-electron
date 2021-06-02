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
        borderRadius: 10,
        color: "whitesmoke",
        fontWeight: "bold",
        padding: 10,
        position: "fixed",
        top: 10,
        right: 10,
      }}
    >
      {children}
    </div>
  );
}
