import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // This must match the export in App.jsx
import "./index.css"; // optional if you’re using it

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
