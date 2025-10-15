import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./ui/app/App.jsx";
import { ContextProvider } from "./core/context/Context.jsx";

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <App />
  </ContextProvider>,
);
