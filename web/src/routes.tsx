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
  }
] as Route[];
