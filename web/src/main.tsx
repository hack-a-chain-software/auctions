import "./index.less";
import React from "react";
import ReactDOM from "react-dom/client";
import Pages from "./router";
import "@fontsource/inter/variable-full.css";
import "@fontsource/poppins/700.css";
import Header from "./components/Header";
import WalletCxt from "./context/WalletProvider";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="fixed pointer-events-none inset-0 bg-shield backdrop-blur-cover z-[-1]" />
    <WalletCxt>
      <Router>
        <Header />
        <Pages />
      </Router>
    </WalletCxt>
  </React.StrictMode>
);
