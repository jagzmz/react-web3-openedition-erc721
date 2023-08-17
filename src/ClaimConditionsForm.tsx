import {
  Web3Button,
  useContract,
  useSetClaimConditions,
} from "@thirdweb-dev/react";
import React from "react";
import { FC } from "react";

interface ClaimConditionsFormProps {
  contractAddress: string;
}

const ClaimConditionsForm: FC<ClaimConditionsFormProps> = ({
  contractAddress,
}) => {
  const { contract } = useContract(contractAddress);
  const {
    mutateAsync: setClaimConditions,
    isLoading,
    error,
  } = useSetClaimConditions(contract);

  const [formValues, setFormValues] = React.useState<{
    maxClaimableSupply?: number;
    price?: string;
  }>({});

  return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    }}>
      <input
        type="number"
        onChange={(e) =>
          setFormValues({
            ...formValues,
            maxClaimableSupply: parseInt(e.target.value),
          })
        }
        placeholder="Max Claimable Supply"
      />
      <input
        type="text"
        onChange={(e) =>
          setFormValues({ ...formValues, price: e.target.value })
        }
        placeholder="Price"
      />
      <Web3Button
        contractAddress={contractAddress}
        action={async () => {
          const result = await setClaimConditions({
            phases: [
              {
                maxClaimablePerWallet: 1,
                maxClaimableSupply: formValues.maxClaimableSupply,
                price: formValues.price,
              },
            ],
          });
          console.log(result);
        }}
      >
        Set Claim Conditions
      </Web3Button>
    </div>
  );
};

export default ClaimConditionsForm;
