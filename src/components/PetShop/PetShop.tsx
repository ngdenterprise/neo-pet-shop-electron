import React from "react";

import ContractState from "../../../src-shared/ContractState";
import Pet from "./Pet";

type Props = {
  contractState: ContractState;
  disabled?: boolean;
  adopt: (petId: number) => Promise<void>;
  feed: (petId: number) => Promise<void>;
};

/**
 * Renders the main Pet Shop UI
 */
export default function PetShop({
  contractState,
  disabled,
  adopt,
  feed,
}: Props) {
  if (!contractState.pets.length) {
    return <div>Loading&hellip;</div>;
  }
  return (
    <div
      style={{
        alignContent: "stretch",
        alignItems: "center",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        overflow: "auto",
      }}
    >
      {contractState.pets.map((_) => (
        <Pet
          disabled={disabled}
          isHungry={_.isHungry}
          key={_.petId}
          lastFed={_.lastFed}
          owner={_.owner}
          petId={_.petId}
          adoptMe={!_.owner ? () => adopt(_.petId) : undefined}
          feedMe={() => feed(_.petId)}
        />
      ))}
    </div>
  );
}
