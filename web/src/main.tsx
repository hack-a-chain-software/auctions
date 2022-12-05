import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router";
import "@fontsource/inter";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="fixed pointer-events-none inset-0 bg-shield backdrop-blur-cover z-[-1]"/>
    <Router />
  </React.StrictMode>
);
