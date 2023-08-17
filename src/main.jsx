import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThirdwebProvider, ThirdwebSDKProvider } from "@thirdweb-dev/react";
import { ethers } from "ethers";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain="mumbai"
      clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
    >
      <ThirdwebSDKProvider
        activeChain="mumbai"
        clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
        signer={new ethers.providers.Web3Provider(window.ethereum).getSigner()}
      >
        <App />
      </ThirdwebSDKProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);
