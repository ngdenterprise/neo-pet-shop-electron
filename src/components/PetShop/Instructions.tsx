import React from "react";

/**
 * Renders instructions for how to use the app.
 */
export default function Instructions() {
  return (
    <div
      style={{
        backgroundColor: "floralwhite",

        padding: 20,
        textAlign: "center",
      }}
    >
      <h2 style={{ fontFamily: "fantasy", margin: 5 }}>
        Welcome to the N3 Pet Shop!
      </h2>
      <p
        style={{
          fontFamily: "serif",
          fontSize: "1.2em",
          margin: "5px 10% 10px 10%",
        }}
      >
        All of these cute critters live on the N3 blockchain! Some of them may
        be in need of caring adoptive parents. If you adopt a pet please
        remember to come back and feed your new furry friend once a day&mdash;if
        your pet becomes hungry, we'll look for someone else to adopt them!
      </p>
      <p
        style={{
          color: "dimgrey",
          fontSize: "0.9em",
          margin: 5,
        }}
      >
        Whenever you adopt or feed a pet, a transaction is created on the N3
        blockchain.
        <br />
        This requires that you have a wallet open, and will cost a small amount
        of GAS.
      </p>
    </div>
  );
}
