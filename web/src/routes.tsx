import Home from './pages/Home';
import { ReactNode } from 'react';
import MyAuctions from './pages/MyAuctions';

type Route = {
  path: string,
  component: ReactNode
};

export const routes = [
  {
    home: "/",
    component: <Home/>
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
