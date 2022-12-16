import MyAuctionsComponent from './MyAuctions.component';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Auction } from 'contract_aptos';

type MyAuctionsFilter = 'offer-live'|'offer-closed'|'offer-won'|'your-live'|'your-closed';

type MyAuctionsProps = {
  filter?: MyAuctionsFilter
}

function MyAuctions(props: MyAuctionsProps) {
  const { filter: initialFilter } = props;
  const navigate = useNavigate();

  const [indexTabHeader, setIndexTabHeader] = useState<number>(initialFilter === 'your-live' ? 1 : 0);
  const [createPanel, showCreatePanel] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<MyAuctionsFilter>(initialFilter ? initialFilter : 'offer-live');
  const [cards, setCards] = useState<Auction[]>([]);

  useEffect(() => {
    //TODO filter cards to show the desired ones by the filter (the selected tab);
    setCards([]);
  }, [filter]);

  useEffect(() => {
    //TODO Add all loading variables to this memo
    setTimeout(() => setLoading(true), 3000);
  }, []);

  function onSwitchTabHeader(tab: number) {
    setIndexTabHeader(tab);
    switch(tab) {
      case 1:
        navigate('/my-auctions/created');
        break;
      default:
        navigate('/my-auctions/offers');
    }
  }

  function onSwitchTabMyOffers(tab: number) {
    switch(tab) {
      case 1:
        setFilter('offer-closed');
        break;
      case 2:
        setFilter('offer-won');
        break;
      default:
        setFilter('offer-live');
    }
  }

  function onSwitchTabMyCreated(tab: number) {
    switch(tab) {
      case 1:
        setFilter('your-closed');
        break;
      default:
        setFilter('your-live');
    }
  }

  const myAuctionsComponentProps = {
    indexTabHeader,
    onSwitchTabHeader,
    onSwitchTabMyOffers,
    onSwitchTabMyCreated,
    loading,
    cards,
    createPanel,
    showCreatePanel
  }

  return <MyAuctionsComponent { ...myAuctionsComponentProps }/>;
}

export default MyAuctions;