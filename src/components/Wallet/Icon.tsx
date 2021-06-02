import React from "react";

type Props = {
  emoji: string;
};

/**
 * Displays an enoji as an icon
 */
export default function Icon({ emoji }: Props) {
  return <span style={{ fontSize: "2.5em", margin: 5 }}>{emoji}</span>;
}
