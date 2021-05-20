import React from "react";

import ContractState from "../../../src-shared/ContractState";
import Pet from "./Pet";

type Props = {
  contractState: ContractState;
  adopt: (petId: number) => Promise<void>;
  feed: (petId: number) => Promise<void>;
};

/**
 * Renders the main Pet Shop UI
 */
export default function PetShop({ contractState, adopt, feed }: Props) {
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
      }}
    >
      {contractState.pets.map((_) => (
        <Pet
          key={_.petId}
          isHungry={_.isHungry}
          lastFed={_.lastFed}
          petId={_.petId}
          owner={_.owner}
          adoptMe={!_.owner ? () => adopt(_.petId) : undefined}
          feedMe={!!_.owner ? () => feed(_.petId) : undefined}
        />
      ))}
    </div>
  );
}
