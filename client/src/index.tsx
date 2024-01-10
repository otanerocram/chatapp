import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MainRoutes from "./MainRoutes";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <MainRoutes />
  </React.StrictMode>
);
