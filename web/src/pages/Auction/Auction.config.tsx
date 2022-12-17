import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useParams } from "react-router";
import AuctionSkeleton from "../../components/AuctionSkeleton";
import { useAuction } from "../../hooks/useAuction";
import { useBid } from "../../hooks/useBid";
import AuctionComponent from "./Auction.component";

function Auction() {
  const { id } = useParams<{ id: string }>();

  const { auction, loading } = useAuction(Number(id));
  const { allBids, loadingBid } = useBid(id!);

  if (!auction || loading || loadingBid) return <AuctionSkeleton />;

  const auctionProps = {
    auction,
    allBids
  };

  return <AuctionComponent {...auctionProps} />;
}

export default Auction;
