import { useEffect, useState } from "react";
import { AuctionClient } from "../config/aptosClient";

export const useClaimPrize = (sender: number, id: number) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const claimRewards = async () => {
      //   await AuctionClient.claimPrize(sender, id);
      console.log("rodei");
    };

    claimRewards();

    return () => setLoading(false);
  }, [sender]);

  return { loading };
};
