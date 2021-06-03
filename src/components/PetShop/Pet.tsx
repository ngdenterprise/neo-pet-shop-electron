import React from "react";

const PETS = [
  { emoji: "🦜", name: "Percy" },
  { emoji: "🐈", name: "Clarence" },
  { emoji: "🦎", name: "Loopy" },
  { emoji: "🦔", name: "Humphry" },
  { emoji: "🐕", name: "Nico" },
  { emoji: "🐇", name: "Randy" },
  { emoji: "🐠", name: "Frederick" },
  { emoji: "🐒", name: "Michael" },
];

const FOODS = [
  "🍇",
  "🍉",
  "🍌",
  "🥕",
  "🥬",
  "🥜",
  "🧀",
  "🍖",
  "🍗",
  "🧆",
  "🥗",
  "🍚",
  "🍪",
  "🥥",
  "🍟",
  "🍕",
];

type Props = {
  disabled?: boolean;
  isHungry: boolean;
  lastFed: Date;
  owner?: string;
  petId: number;
  adoptMe?: () => Promise<void>;
  feedMe?: () => Promise<void>;
};

/**
 * Renders an individual pet
 */
export default function Pet({
  disabled,
  isHungry,
  lastFed,
  owner,
  petId,
  adoptMe,
  feedMe,
}: Props) {
  const pet = PETS[petId] || { emoji: "👻", name: "0x000000" };
  return (
    <div style={{ margin: 10, padding: 10, textAlign: "center" }}>
      <div
        style={{
          backgroundColor: "ghostwhite",
          border: "10px solid gold",
          display: "inline-block",
          minWidth: 350,
          padding: "5px 5px 20px 5px",
          position: "relative",
          width: "70%",
        }}
      >
        <span
          style={{
            backgroundColor: "darkslateblue",
            borderRadius: 15,
            color: "lightgrey",
            fontFamily: "sans-serif",
            fontWeight: "bolder",

            padding: 5,
            position: "absolute",
            right: -30,
            top: -35,
          }}
        >
          {owner ?? "Please adopt me!"}
        </span>
        <span style={{ fontSize: 30 }}>
          {isHungry ? " " : FOODS[lastFed.getMilliseconds() % FOODS.length]}
        </span>
        <span style={{ fontSize: 120 }}> {pet.emoji}</span>
        {!!feedMe && (
          <button
            disabled={disabled}
            style={{ position: "absolute", bottom: 3, left: 3, padding: 5 }}
            onClick={feedMe}
          >
            Feed me!
          </button>
        )}
        {!!adoptMe && (
          <button
            disabled={disabled}
            style={{ position: "absolute", bottom: 3, padding: 5, right: 3 }}
            onClick={adoptMe}
          >
            Adopt me!
          </button>
        )}
      </div>
      <div>
        <span
          style={{
            backgroundColor: "gold",
            borderRadius: "0 0 15px 15px",
            color: "firebrick",
            fontFamily: "cursive",
            fontWeight: "bolder",
            padding: "4px 25px 4px 25px",
          }}
        >
          {pet.name} {isHungry ? "☹️" : "😋"}
        </span>
      </div>
    </div>
  );
}
