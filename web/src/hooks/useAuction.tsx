import { Auction } from "contract_aptos";
import { useEffect, useState } from "react";
import { AuctionClient } from "../config/aptosClient";

export const useAuction = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      const data = await AuctionClient.getAllAuctions(1, 2);
      setAuctions(data);
    };

    fetchAuctions();

    return () => setLoading(false);
  }, []);
  
  return { auctions, loading };
};
