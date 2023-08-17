import {
  WalletInstance,
  Web3Button,
  useChain,
  useSDK,
  useSwitchChain,
  useWallet,
} from "@thirdweb-dev/react";
import { AvalancheFuji } from "@thirdweb-dev/chains";
import React, { FC, useEffect } from "react";

interface FormValues {
  name: string;
  description?: string;
  symbol: string;
  image?: File;
  supply: number;
  maxQuantityPerOrder: number;
}

const DeployContract: FC<{
  wallet: WalletInstance;
  onDeployed: (contractAddress: string) => void;
}> = ({ wallet, onDeployed }) => {
  const sdk = useSDK();
  if (!sdk) return null;

  const chain = useChain();
  if (!chain) return null;

  const [contractAddress, setContractAddress] = React.useState<string>("");
  const [formValues, setFormValues] = React.useState<FormValues>({
    name: "",
    symbol: "",
    maxQuantityPerOrder: 1,
    supply: 10,
  });

  const deployContract = async (formValues: FormValues) => {
    const address = await wallet.getAddress();
    const cAddress = await sdk.deployer.deployOpenEdition({
      ...formValues,
      primary_sale_recipient: address,
    });
    setContractAddress(cAddress);
    onDeployed(cAddress);
    window.localStorage.setItem(
      "oldContracts",
      `${window.localStorage.getItem("oldContracts")},${cAddress}`
    );
  };

  return (
    <div>
      {!contractAddress && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Contract Name"
            onChange={(e) =>
              setFormValues({ ...formValues, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Enter Contract Description"
            onChange={(e) =>
              setFormValues({ ...formValues, description: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Enter Contract Symbol"
            onChange={(e) =>
              setFormValues({ ...formValues, symbol: e.target.value })
            }
          />
          {/* Image Upload */}
          {formValues.image && (
            <div>
              <img
                src={URL.createObjectURL(formValues.image)}
                alt="NFT"
                width={200}
                height={200}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setFormValues({ ...formValues, image: e.target.files[0] });
              }
            }}
          />
          <button
            onClick={() => {
              deployContract(formValues);
            }}
          >
            Deploy Contract
          </button>
        </div>
      )}
      {contractAddress && <div>Contract Address: {contractAddress}</div>}
    </div>
  );
};

export default DeployContract;
