import React from "react";

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
  return (
    <div style={{ margin: 10, padding: 10, textAlign: "center" }}>
      <div>
        <strong>Pet {petId}</strong>
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
