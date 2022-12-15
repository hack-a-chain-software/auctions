import { useParams } from "react-router";
import { useAuction } from "../../hooks/useAuction";
import { useBid } from "../../hooks/useBid";
import AuctionComponent from "./Auction.component";

function Auction() {
  const { id } = useParams<{ id: string }>();
  const { allBids, yourBids, loadingBid } = useBid(id!, "1");
  const { auction, loading } = useAuction(Number(id));

  if (loading || loadingBid || !auction) return <h1>loading...</h1>;

  const auctionProps = {
    auction,
    allBids,
    yourBids,
  };

  return <AuctionComponent {...auctionProps} />;
}

export default Auction;
