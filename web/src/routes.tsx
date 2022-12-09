import { ReactNode } from 'react';
import MyAuctions from './pages/MyAuctions';
import ExploreAuctions from './pages/ExploreAuctions';

type Route = {
  path: string,
  component: ReactNode
};

export const routes = [
  {
    path: "/",
    component: <ExploreAuctions/>
  },
  {
    path: "my-auctions",
    component: <MyAuctions/>
  },
  {
    path: "my-auctions/offers",
    component: <MyAuctions filter="offer-live"/>
  },
  {
    path: "my-auctions/created",
    component: <MyAuctions filter="your-live"/>
  }
] as Route[];
