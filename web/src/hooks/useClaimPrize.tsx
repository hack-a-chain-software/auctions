import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useEffect, useState } from "react";
import { AuctionClient } from "../config/aptosClient";

export const useClaimPrize = (sender: any, id: number) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { account } = useWallet();

  useEffect(() => {
    if (!account) return;

    const claimRewards = async () => {
      // await AuctionClient.claimPrize(account.address, id);
    };

    claimRewards();

    return () => setLoading(false);
  }, []);

  return { loading };
};
