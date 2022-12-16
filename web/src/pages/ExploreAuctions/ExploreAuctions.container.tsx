import { useEffect, useState } from 'react';
import ExploreAuctionsComponent from './ExploreAuctions.component';
import { useAuctions } from '../../hooks/useAuctions';
import { Auction } from 'contract_aptos';

function ExploreAuctions() {
  const { loading: fetchLoading, auctions } = useAuctions();

  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [cards, setCards] = useState<Auction[]>([]);

  useEffect(() => {
    if(search === '')
      return setCards(auctions);
    setCards(auctions.filter(auction => {
      if(auction.id.toString().includes(search.toLowerCase()))
        return true;
      if(auction.lockedTokenId.token_data_id.creator.toLowerCase().includes(search.toLowerCase()))
        return true;
      if(auction.lockedTokenId.token_data_id.collection.toLowerCase().includes(search.toLowerCase()))
        return true;
      if(auction.lockedTokenId.token_data_id.name.toLowerCase().includes(search.toLowerCase()))
        return true;
      return false;
    }));
  }, [search, auctions]);

  useEffect(() => {
    setLoading(fetchLoading);
  }, [fetchLoading]);

  const exploreAuctionsComponentProps = {
    loading,
    search,
    setSearch,
    cards,
  }

  return <ExploreAuctionsComponent { ...exploreAuctionsComponentProps }/>;
}

export default ExploreAuctions;