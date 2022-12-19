import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { AuctionClient } from "../config/aptosClient";

export const useMakeOffer = async (
  id: string,
  bid: string,
  coinType: string
) => {
  const { signAndSubmitTransaction } = useWallet();
  await AuctionClient.bid(
    (payload) => signAndSubmitTransaction(payload),
    id,
    bid,
    coinType
  );
};
