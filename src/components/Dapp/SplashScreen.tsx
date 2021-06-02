import React from "react";

import CenterInScreen from "../CenterInScreen";

/**
 * Content that is rendered for the first few seconds after the app
 * is loaded (while waiting for code in the Electron process to poll
 * the contract state).
 */
export default function SplashScreen() {
  return (
    <CenterInScreen>
      <div>Loading...</div>
    </CenterInScreen>
  );
}
