import "./App.css";
import { ConnectWallet, useWallet } from "@thirdweb-dev/react";
import DeployContract from "./DeployContract";
import ContractProfile from "./ContractProfile";
import { useState } from "react";
import ClaimConditionsForm from "./ClaimConditionsForm";

function App() {

  const [deployedContractAddress, setDeployedContractAddress] = useState(null);

  const wallet = useWallet();

  const windowLocation = window.location.href;
  if (windowLocation.includes("contract=")) {
    return (
      <ContractProfile contractAddress={windowLocation.split("contract=")[1]} />
    );
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        Old Contracts
        {window.localStorage.getItem("oldContracts") && (
          <pre>
            {window.localStorage
              .getItem("oldContracts")
              .split(",")
              .map((c) => (
                <div key={c}>
                  <a
                    href={`?contract=${c}`}
                    style={{
                      color: "white",
                      textDecorationLine: "underline",
                    }}
                  >
                    {c}
                  </a>
                </div>
              ))}
          </pre>
        )}
      </div>
      <ConnectWallet />
      {wallet && (
        <>
          <hr style={{ margin: "20px 0", width: 500 }} />
          <div>
            <DeployContract
              wallet={wallet}
              onDeployed={setDeployedContractAddress}
            />
          </div>
        </>
      )}
      {deployedContractAddress && (
        <ClaimConditionsForm contractAddress={deployedContractAddress} />
      )}
    </>
  );
}

export default App;
