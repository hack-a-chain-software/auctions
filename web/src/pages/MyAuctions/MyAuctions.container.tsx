import MyAuctionsComponent from './MyAuctions.component';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Auction } from 'contract_aptos';
import { useMyAuctions } from '../../hooks/useMyAuctions';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { useTimer } from '../../hooks/useTimer';

type MyAuctionsFilter = 'offer-live'|'offer-closed'|'offer-won'|'your-live'|'your-closed';

type MyAuctionsProps = {
  filter?: MyAuctionsFilter
}

function MyAuctions(props: MyAuctionsProps) {
  const { filter: initialFilter } = props;
  const navigate = useNavigate();
  const { account } = useWallet();
  const { loading: fetchLoading, offers, created, fetchOffers, fetchCreated } = useMyAuctions();
  const getDate = useTimer;

  const [indexTabHeader, setIndexTabHeader] = useState<number>(initialFilter === 'your-live' ? 1 : 0);
  const [createPanel, showCreatePanel] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<MyAuctionsFilter>(initialFilter ? initialFilter : 'offer-live');
  const [cards, setCards] = useState<Auction[]>([]);

  useEffect(() => {
    setCards([]);
  }, [initialFilter]);

  useEffect(() => {
    setCards([]);
    if(!account?.address)
      return setLoading(false);

    switch(filter) {
      case 'offer-live':
        if(offers.length === 0)
          fetchOffers(account.address);
        else setCards(offers.filter(auction => getDate(Number(auction.endTime)).endDate >= new Date()));
        break;
      case 'offer-won':
        if(offers.length === 0)
          fetchOffers(account.address);
        else setCards(offers.filter(
          auction => getDate(Number(auction.endTime)).endDate < new Date()
                     && account.address === auction.currentBidder
        ));
        break;
      case 'offer-closed':
        if(offers.length === 0)
          fetchOffers(account.address);
        else setCards(offers.filter(auction => getDate(Number(auction.endTime)).endDate < new Date()));
        break;
      case 'your-live':
        if(created.length === 0)
          fetchCreated(account.address);
        else setCards(created.filter(auction => getDate(Number(auction.endTime)).endDate >= new Date()));
        break;
      case 'your-closed':
        if(created.length === 0)
          fetchCreated(account.address);
        else setCards(created.filter(auction => getDate(Number(auction.endTime)).endDate < new Date()));
        break;
      default:
        setLoading(false);
        setCards([]);
    }
  }, [filter, offers, created, account?.address]);

  useEffect(() => {
    if(!account?.address)
      setLoading(fetchLoading);
    setLoading(false);
  }, [fetchLoading]);

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