import React from "react";
import ReactDOM from "react-dom";

import CenterInScreen from "./components/CenterInScreen";
import Dapp from "./components/Dapp/Dapp";

ReactDOM.render(
  <React.StrictMode>
    <CenterInScreen>
      <Dapp />
    </CenterInScreen>
  </React.StrictMode>,
  document.getElementById("root")
);
