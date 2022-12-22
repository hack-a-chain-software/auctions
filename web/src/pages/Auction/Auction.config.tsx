import { useEffect } from "react";
import { useParams } from "react-router";
import AuctionSkeleton from "../../components/AuctionSkeleton";
import { useAuction } from "../../hooks/useAuction";
import { useBid } from "../../hooks/useBid";
import AuctionComponent from "./Auction.component";

function Auction() {
  const { id } = useParams<{ id: string }>();

  const { auction, loading, fetchAuctions } = useAuction(Number(id));
  const { allBids, fetchBids } = useBid(id!);

  useEffect(() => {
    fetchAuctions();
    fetchBids();
  }, []);

  if (!auction || loading) return <AuctionSkeleton />;

  const auctionProps = {
    auction,
    allBids,
  };

  return <AuctionComponent {...auctionProps} />;
}

export default Auction;
