import { Bid } from "contract_aptos";
import { useState } from "react";
import { AuctionClient } from "../config/aptosClient";

export const useBid = (auctionId: string) => {
  const [loadingBid, setLoadingBid] = useState<boolean>(true);
  const [allBids, setAllBids] = useState<Bid[]>([]);
  let running = false;

  const fetchBids = () => {
    if (running) return;
    setLoadingBid((running = true));

    AuctionClient.getBidsAuction(auctionId)
      .then((res) => setAllBids(res))
      .then(() => (running = false))
      .then(setLoadingBid);
  };

  return { allBids, loadingBid, fetchBids };
};
