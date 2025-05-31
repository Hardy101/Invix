import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { registerSW } from "virtual:pwa-register";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId =
  "929640660775-lsov2dealio9dfbp65snpehhsnndr14k.apps.googleusercontent.com";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Refresh to update?")) {
      updateSW(true);
    }
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
