import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { OverlayToaster } from "@blueprintjs/core";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <>
    <OverlayToaster></OverlayToaster>,
    <App />
  </>
  // </React.StrictMode>
);
