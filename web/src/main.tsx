import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router";
import Web3Provider from "@fewcha/web3-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3Provider>
      <Router />
    </Web3Provider>
  </React.StrictMode>
);
