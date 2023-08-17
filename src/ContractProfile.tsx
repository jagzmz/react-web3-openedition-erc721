import {
  Web3Button,
  useClaimConditions,
  useContract,
  useMetadata,
} from "@thirdweb-dev/react";
import React, { useEffect } from "react";
import { FC } from "react";
import { BigNumber, ethers } from "ethers";
import { getChainByChainId } from "@thirdweb-dev/chains";
import ClaimConditionsForm from "./ClaimConditionsForm";

const ContractProfile: FC<{
  contractAddress: string;
}> = ({ contractAddress }) => {
  const { isLoading, error, contract } = useContract(contractAddress);
  const metadata = useMetadata(contract);
  const { data: claimConditions } = useClaimConditions(contract);

  const [totalClaimed, setTotalClaimed] = React.useState<BigNumber>(
    ethers.BigNumber.from(0)
  );

  useEffect(() => {
    if (!contract) return;
    const getTotalClaimed = async () => {
      const totalClaimed = await contract.erc721.totalClaimedSupply();
      setTotalClaimed(totalClaimed);
    };
    getTotalClaimed();
  }, [contract]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (error) {
    return <div>Error: {JSON.stringify(error, null, 4)}</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <div>Contract Address: {contractAddress}</div>
      <hr />
      {metadata.isFetched && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <img src={(metadata.data as any)?.image} width={300} height={300} />
          <div>Name: {(metadata.data as any)?.name}</div>
          <div>Description: {(metadata.data as any)?.description}</div>
          <div>Symbol: {(metadata.data as any)?.symbol}</div>
        </div>
      )}
      {claimConditions?.length === 0 && (
        <div>
          <ClaimConditionsForm contractAddress={contractAddress} />
        </div>
      )}
      {claimConditions?.map((claimCondition, index) => {
        return (
          <div key={index}>
            <div>Claim Condition: {index + 1}</div>
            <div>Available Supply: {claimCondition.availableSupply}</div>
            <div>
              Claim Price: {ethers.utils.formatEther(claimCondition.price)}
            </div>
            <div>
              Max Claim Per Wallet: {claimCondition.maxClaimablePerWallet}
            </div>
            {contract?.chainId && (
              <div>
                Contract Chain: {getChainByChainId(contract.chainId).name}
              </div>
            )}
          </div>
        );
      })}
      {totalClaimed && <div>Total Claimed: {totalClaimed.toString()}</div>}
      {contract && (
        <Web3Button
          contractAddress={contractAddress}
          action={async (contract) => {
            const result = await contract.erc721?.claim(1);
            console.log(`Claimed: ${result}`);
          }}
        >
          Claim
        </Web3Button>
      )}
    </div>
  );
};

export default ContractProfile;
