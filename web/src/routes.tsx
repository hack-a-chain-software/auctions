import { ReactNode } from "react";
import MyAuctions from "./pages/MyAuctions";
import ExploreAuctions from "./pages/ExploreAuctions";
import Auction from "./pages/Auction";
import WalletTest from "./pages/wallet_test";

type Route = {
  path: string;
  component: ReactNode;
  key?: number;
};

export const routes = [
  {
    path: "/",
    component: <ExploreAuctions />,
  },
  {
    path: "/auction/:id",
    component: <Auction />
  },
  {
    path: "my-auctions",
    component: <MyAuctions />,
  },
  {
    path: "my-auctions/offers",
    component: <MyAuctions filter="offer-live" />,
  },
  {
    path: "my-auctions/created",
    component: <MyAuctions filter="your-live" />,
  },
  {
    path: "/wallet_test",
    component: <WalletTest />,
  },
] as Route[];
