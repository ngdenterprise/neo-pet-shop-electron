import React from "react";

type Props = {
  children: any;
};

/**
 * Renders content vertically and horizontally centered
 */
export default function CenterInScreen({ children }: Props) {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <div>{children}</div>
    </div>
  );
}
