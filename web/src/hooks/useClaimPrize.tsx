import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useCallback } from "react";
import { AuctionClient } from "../config/aptosClient";

export const useClaimPrize = (id: number) => {
  const { signAndSubmitTransaction } = useWallet();

  const claimRewards = useCallback(async () => {
    await AuctionClient.claimPrize(
      (payload) => signAndSubmitTransaction(payload),
      id
    );
  }, []);

  return { claimRewards };
};
