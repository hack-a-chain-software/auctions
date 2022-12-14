import { Bid } from "contract_aptos";
import { useEffect, useState } from "react";
import { AuctionClient } from "../config/aptosClient";

export const useBid = (auctionId: string) => {
  const [allBids, setAllBids] = useState<Bid[]>([]);

  useEffect(() => {
    const fetchBids = async () => {
      const data = await AuctionClient.getBidsAuction(auctionId);
      setAllBids(data);
    };

    fetchBids();
  }, []);

  const bids = allBids.sort((a, b) => {
    if (a.bid < b.bid) return 1;
    if (a.bid > b.bid) return -1;
    return 0;
  });

  return { bids };
};
