import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useCallback } from "react";
import { AuctionClient } from "../config/aptosClient";

export const useMakeOffer = (id: string, bid: string, coinType: string) => {
  const { signAndSubmitTransaction } = useWallet();

  const makeOffer = useCallback(async () => {
    await AuctionClient.bid(
      (payload) => signAndSubmitTransaction(payload),
      id,
      bid,
      coinType
    );
  }, []);

  return { makeOffer };
};
