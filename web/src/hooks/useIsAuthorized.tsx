import { AuctionClient } from '../config/aptosClient';
import { useState } from 'react';

export const useIsAuthorized: () => {
  isAuthorized: boolean,
  fetch: (account: string) => void,
  loading: boolean
} = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  let running = false;

  function fetch(account: string) {
    if(running)
      return;

    running = true;
    AuctionClient.isUserAuthorized(account)
      .then(setIsAuthorized)
      .then(() => running = false)
      .then(setLoading)
      .catch(error => {
        console.error(error);
        setLoading(running = false);
        return false;
      });
  }

  return { loading, fetch, isAuthorized };
}