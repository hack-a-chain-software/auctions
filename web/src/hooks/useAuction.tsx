import { Auction } from "contract_aptos";
import { useEffect, useState } from "react";
import { AuctionClient } from "../config/aptosClient";

export const useAuction = (auctionId: number) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [auction, setAuction] = useState<Auction | null>();

  useEffect(() => {
    const fetchAuctions = async () => {
      const data: Auction[] = await AuctionClient.getAllAuctions(auctionId, 1);

      if (data.length > 0) {
        setAuction(data[0]);
      }
    };

    fetchAuctions();

    return () => setLoading(false);
  }, []);

  return { auction, loading };
};
