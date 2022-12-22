import { Auction } from "contract_aptos";
import { useState } from "react";
import { AuctionClient } from "../config/aptosClient";

export const useAuction = (auctionId: number) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [auction, setAuction] = useState<Auction | null>();
  let running = false;

  const fetchAuctions = () => {
    if (running) return;
    setLoading((running = true));
    AuctionClient.getAllAuctions(auctionId, 1)
      .then((res) => res.length > 0 && setAuction(res[0]))
      .then(() => (running = false))
      .then(setLoading);
  };

  return { auction, loading, fetchAuctions };
};
