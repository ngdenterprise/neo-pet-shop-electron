import React from "react";

type Props = {
  autoFocus?: boolean;
  disabled?: boolean;
  label: string;
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
        type="text"
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
