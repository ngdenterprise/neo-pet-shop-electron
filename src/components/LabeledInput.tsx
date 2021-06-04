import React from "react";

type Props = {
  autoFocus?: boolean;
  disabled?: boolean;
  label: string;
  type: "text" | "password";
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

/**
 * Renders an HTML input with an accessible label.
 */
export default function LabeledInput({
  autoFocus,
  disabled,
  label,
  type,
  value,
  onChange,
}: Props) {
  return (
    <label
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {label}
      <input
        autoFocus={autoFocus}
        disabled={disabled}
        style={{ width: "80%", margin: 10, padding: 10 }}
        type={type}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
