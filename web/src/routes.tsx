import { ReactNode } from "react";
import MyAuctions from "./pages/MyAuctions";
import ExploreAuctions from "./pages/ExploreAuctions";
import Auction from "./pages/Auction";

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
    component: <Auction />,
  },
  {
    path: "my-auctions/:filter",
    component: <MyAuctions />,
  }
] as Route[];
