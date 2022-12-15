import { Bid } from "contract_aptos";
import { useEffect, useState } from "react";
import { AuctionClient } from "../config/aptosClient";

export const useBid = (auctionId: string, user: string | null) => {
  const [allBids, setAllBids] = useState<Bid[]>([]);
  const [yourBids, setYourBids] = useState<Bid[]>([]);

  useEffect(() => {
    const fetchBids = async () => {
      const data = await AuctionClient.getBidsAuction(auctionId);
      setAllBids(data);
    };

    fetchBids();
  }, []);

  if (user)
    setYourBids(() => allBids.filter(({ account }) => account === user));

  return { allBids, yourBids };
};
