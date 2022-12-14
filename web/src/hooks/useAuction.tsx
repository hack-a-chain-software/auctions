import { Auction } from "contract_aptos";
import { useEffect, useState } from "react";
import { AuctionClient } from "../config/aptosClient";

export const useAuction = (auctionId: number) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [auction, setAuction] = useState<Auction>({} as Auction);

  useEffect(() => {
    const fetchAuctions = async () => {
      const data = await AuctionClient.getAllAuctions(1, 2);
      setAuctions(data);
    };

    fetchAuctions();

    // const res = auctions.find(({ id }) => id === auctionId);

    // if (res) setAuction(res);

    return () => setLoading(false);
  }, []);

  return { auction, loading };
};
