import React from "react";

const PETS = [
  { emoji: "🦜", name: "Percy" },
  { emoji: "🐈", name: "Clarence" },
  { emoji: "🦎", name: "Loopy" },
  { emoji: "🐕", name: "Nico" },
  { emoji: "🦔", name: "Humphry" },
  { emoji: "🐇", name: "Randy" },
  { emoji: "🐠", name: "Frederick" },
  { emoji: "🐒", name: "Michael" },
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
      <div style={{ fontSize: 120 }}>{pet.emoji}</div>
      <div>
        <strong>{pet.name}</strong>
      </div>
      {isHungry && (
        <div>
          <em>I'm hungry!</em>
        </div>
      )}
      <div>Last fed: {`${lastFed}`}</div>
      {!!owner && <div>Owner: {owner}</div>}
      {!!adoptMe && (
        <div>
          <button disabled={disabled} onClick={adoptMe}>
            Adopt me!
          </button>
        </div>
      )}
      {!!feedMe && (
        <div>
          <button disabled={disabled} onClick={feedMe}>
            Feed me!
          </button>
        </div>
      )}
    </div>
  );
}
