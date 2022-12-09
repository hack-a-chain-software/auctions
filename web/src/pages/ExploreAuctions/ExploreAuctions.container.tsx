import { useEffect, useState } from 'react';
import ExploreAuctionsComponent from './ExploreAuctions.component';

function ExploreAuctions() {
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [cards, setCards] = useState<string[]>([]);

  useEffect(() => {
    //TODO filter cards to show the desired ones by the filters/search bar;
    setCards([]);
  }, [search]);

  useEffect(() => {
    //TODO Add all loading variables to this memo
    setTimeout(() => setLoading(false), 3000);
  }, []);

  const exploreAuctionsComponentProps = {
    loading,
    search,
    setSearch,
    cards,
  }

  return <ExploreAuctionsComponent { ...exploreAuctionsComponentProps }/>;
}

export default ExploreAuctions;