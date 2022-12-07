import "./index.less";
import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router";
import "@fontsource/inter/variable-full.css";
import "@fontsource/poppins/700.css";
import Header from "./components/Header";
import { AuctionHouseClient } from "contract_aptos";
import Web3Provider from "@fewcha/web3-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="fixed pointer-events-none inset-0 bg-shield backdrop-blur-cover z-[-1]"/>
    <Web3Provider>
    <Header />
    <Router />
    </Web3Provider>
  </React.StrictMode>
);
