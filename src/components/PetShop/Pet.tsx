import React from "react";

type Props = {
  petId: number;
  isHungry: boolean;
  owner?: string;
  lastFed: Date;
  adoptMe?: () => Promise<void>;
  feedMe?: () => Promise<void>;
};

/**
 * Renders an individual pet
 */
export default function Pet({
  petId,
  isHungry,
  owner,
  lastFed,
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
          <button onClick={adoptMe}>Adopt me!</button>
        </div>
      )}
      {!!feedMe && (
        <div>
          <button onClick={feedMe}>Feed me!</button>
        </div>
      )}
    </div>
  );
}
