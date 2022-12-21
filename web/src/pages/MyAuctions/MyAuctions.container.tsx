import MyAuctionsComponent from './MyAuctions.component';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Auction } from 'contract_aptos';
import { useMyAuctions } from '../../hooks/useMyAuctions';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { useTimer } from '../../hooks/useTimer';
import { useIsAuthorized } from '../../hooks/useIsAuthorized';

type MyAuctionsFilter = 'offer-live'|'offer-closed'|'offer-won'|'your-live'|'your-closed';

function MyAuctions() {
  const { filter: initialFilter } = useParams<{ filter: string }>();
  const navigate = useNavigate();
  const { account } = useWallet();
  const { loading: fetchLoading, offers, created, fetchOffers, fetchCreated } = useMyAuctions();
  const { isAuthorized, fetch: fetchIsAuthorized } = useIsAuthorized();
  const getDate = useTimer;

  const [canCreateAuction, setCanCreateAuction] = useState<boolean>(false);
  const [indexTabHeader, setIndexTabHeader] = useState<number>(0);
  const [indexTabs, setIndexTabs] = useState<number>(0);
  const [createPanel, showCreatePanel] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<MyAuctionsFilter>('offer-live');
  const [cards, setCards] = useState<Auction[]>([]);

  useEffect(() => {
    if(!account?.address)
      return;
    fetchIsAuthorized(account.address.toString());
  }, [account?.address]);

  useEffect(() => {
    setCards([]);
    switch(initialFilter) {
      case 'your-live':
        setIndexTabHeader(1);
        setIndexTabs(0);
        setFilter('your-live');
        break;
      case 'your-closed':
        setIndexTabHeader(1);
        setIndexTabs(1);
        setFilter('your-closed');
        break;
      case 'offer-closed':
        setIndexTabHeader(0);
        setIndexTabs(1);
        setFilter('offer-closed');
        break;
      case 'offer-won':
        setIndexTabHeader(0);
        setIndexTabs(2);
        setFilter('offer-won');
        break;
      default:
        setIndexTabHeader(0);
        setIndexTabs(0);
        setFilter('offer-live');
    }
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
    setCanCreateAuction(isAuthorized);
  }, [isAuthorized]);

  useEffect(() => {
    if(!account?.address)
      setLoading(fetchLoading);
    setLoading(false);
  }, [fetchLoading]);

  function onSwitchTabHeader(tab: number) {
    setIndexTabHeader(tab);
    switch(tab) {
      case 1:
        navigate('/my-auctions/your-live');
        break;
      default:
        navigate('/my-auctions/offer-live');
    }
  }

  function onSwitchTabMyOffers(tab: number) {
    setIndexTabs(tab);
    switch(tab) {
      case 1:
        navigate('/my-auctions/offer-closed');
        break;
      case 2:
        navigate('/my-auctions/offer-won');
        break;
      default:
        navigate('/my-auctions/offer-live');
    }
  }

  function onSwitchTabMyCreated(tab: number) {
    setIndexTabs(tab);
    switch(tab) {
      case 1:
        navigate('/my-auctions/your-closed');
        break;
      default:
        navigate('/my-auctions/your-live');
    }
  }

  const myAuctionsComponentProps = {
    indexTabHeader,
    indexTabs,
    onSwitchTabHeader,
    onSwitchTabMyOffers,
    onSwitchTabMyCreated,
    loading,
    cards,
    createPanel,
    showCreatePanel,
    canCreateAuction
  }

  return <MyAuctionsComponent { ...myAuctionsComponentProps }/>;
}

export default MyAuctions;