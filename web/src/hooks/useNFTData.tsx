import { TokenTypes } from 'aptos';
import { tokenClient } from '../config/aptosClient';
import { useState } from 'react';

export const useNFTData: () => {
  data: TokenTypes.TokenData|null,
  fetch: (creator: string, collection: string, name: string) => void
  loading: boolean
} = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<TokenTypes.TokenData|null>(null);
  let running = false;

  function fetch(creator: string, collection: string, name: string) {
    if(running)
      return;

    setLoading(running = true);
    tokenClient.getTokenData(creator, collection, name)
      .then(setData)
      .then(() => running = false)
      .then(setLoading)
      .catch(error => {
        console.error(error);
        setLoading(running = false);
        return null;
      });
  }

  return { loading, data, fetch };
}