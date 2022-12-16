import "./index.less";
import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router";
import "@fontsource/inter/variable-full.css";
import "@fontsource/poppins/700.css";
import Header from "./components/Header";
import WalletCxt from "./context/WalletProvider";
import { TestContextProvider } from "./context/TestContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="fixed pointer-events-none inset-0 bg-shield backdrop-blur-cover z-[-1]" />
    <WalletCxt>
      <TestContextProvider>
        <Header />
        <Router />
      </TestContextProvider>
    </WalletCxt>
  </React.StrictMode>
);
