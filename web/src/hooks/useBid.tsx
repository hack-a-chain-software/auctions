import { Bid } from "contract_aptos";
import { useEffect, useState } from "react";
import { AuctionClient } from "../config/aptosClient";

export const useBid = (auctionId: string) => {
  const [loadingBid, setLoadingBid] = useState<boolean>(true);
  const [allBids, setAllBids] = useState<Bid[]>([]);

  useEffect(() => {
    const fetchBids = async () => {
      const data = await AuctionClient.getBidsAuction(auctionId);
      setAllBids(data);
    };

    fetchBids();

    return () => setLoadingBid(false);
  }, []);

  return { allBids, loadingBid };
};
