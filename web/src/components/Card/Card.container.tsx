import CardComponent from './Card.component';
import { Auction } from 'contract_aptos';
import { useNFTData } from '../../hooks/useNFTData';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { useAuctionBids } from '../../hooks/useAuctionBids';
import { useCoinInfo } from '../../hooks/useCoinInfo';
import { useTimer } from '../../hooks/useTimer';
import { formatDecimals } from '../../utils/formatDecimals';
import { useClaim } from '../../hooks/useClaim';
import Big from 'big.js';

type CardProps = Auction & {
  created?:boolean
  explore?:boolean
}

function Card(props: CardProps) {
  const {
    id,
    creator: author,
    startTime,
    endTime,
    minSellingPrice,
    currentBid,
    currentBidder,
    auctionCoin,
    coinsClaimed,
    tokenClaimed,
    lockedTokenId: {
      token_data_id: {
        creator,
        collection,
        name
      }
    },
    created,
    explore
  } = props;
  const { loading, hash, claimPrize, claimCoins } = useClaim();
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true);
  const { account, signAndSubmitTransaction } = useWallet();
  const { data, fetch, loading: loadingData } = useNFTData();
  const { bids, fetch: fetchBids } = useAuctionBids();
  const { info , fetch: fetchCoin } = useCoinInfo();
  const navigation = useNavigate();
  const getDate = useTimer;

  useEffect(() => {
    fetch(creator, collection, name);
  }, [creator, collection, name]);

  useEffect(() => {
    fetchCoin(auctionCoin)
  }, [auctionCoin]);

  useEffect(() => {
    fetchBids(`${id}`)
  }, [id]);

  useEffect(() => {
    if(hash.length < 10)
      return;
    window.location.reload();
  }, [hash]);


  const bid = useMemo(() => {
    if(!info)
      return new Big(0);
    return formatDecimals(currentBid, info.decimals);
  }, [info]);

  const live = useMemo(() => {
    return new Date() < getDate(Number(endTime)).endDate;
  }, [endTime]);

  const won = useMemo(() => {
    return !live && !bid.eq(0) && account?.address === currentBidder && !created
  }, [live, bid, currentBidder, created, account?.address]);

  useEffect(() => {
    if(created && !live && new Big(currentBid).eq(0) && tokenClaimed)
      return setIsButtonEnabled(false);
    if(created && !live && !new Big(currentBid).eq(0) && coinsClaimed)
      return setIsButtonEnabled(false);
    if(!created && !explore && won && coinsClaimed)
      return setIsButtonEnabled(false);
    setIsButtonEnabled(!loading);
  }, [loading, won]);

  const image = useMemo(() => {
    if(!data || loadingData)
      return '';
    return data.uri;
  }, [data, loadingData]);

  const iBided = useMemo(() => {
    if(!bids || !account?.address)
      return false;
    return bids.reduce(
      (iDid: boolean, bid) => account.address?.toString().replace('0x0', '0x') === bid.account ? true : iDid, false
    );
  }, [bids, account?.address]);

  const { symbol: currency } = useMemo(() => {
    if(!info)
      return { symbol: '' };
    return info;
  }, [info]);

  const initialPrice = useMemo(() => {
    if(!info)
      return new Big(0);
    return formatDecimals(minSellingPrice, info.decimals);
  }, [minSellingPrice, info]);

  const myBid = useMemo(() => {
    if(!info || bids.length === 0)
      return new Big(0);
    const myBid = bids.find(bid => bid.account === account?.address);
    if(!myBid)
      return new Big(0);
    return formatDecimals(myBid.bid, info.decimals);
  }, [info, bids, account?.address]);

  const winning = useMemo(() => {
    return iBided && account?.address === currentBidder;
  }, [account?.address, iBided, currentBidder]);

  function onButtonClick() {
    if(created && !live && new Big(currentBid).eq(0) && !tokenClaimed)
      return claimPrize(signAndSubmitTransaction, id);
    if(created && !live && !new Big(currentBid).eq(0) && !coinsClaimed)
      return claimCoins(signAndSubmitTransaction, auctionCoin, id);
    if(!created && !explore && won && !coinsClaimed)
      return claimCoins(signAndSubmitTransaction, auctionCoin, id);
    navigation(`/auction/${id}`);
  }

  const cardComponentProps = {
    // If auction is closed of live
    live,
    // If the auction has no bids
    noBids: bid.eq(0),
    // If the logged account won the auction
    won,
    // If the logged account made an offer/bid
    iBided,
    // If the logged account has the highest offer/bid
    winning,
    // If the card is on the created page
    created: !!created,
    // If the card is on the explore page
    explore: !!explore,

    onButtonClick,
    isButtonEnabled,
    collection,
    name,
    image,
    bidder: bid.eq(0) ? author : currentBidder,
    bid: bid.eq(0) ? initialPrice.toFixed(3) : bid.toFixed(3),
    myBid: myBid.toFixed(3),
    currency,
    createdAt: getDate(Number(startTime)).endDate,
    closedAt: getDate(Number(endTime)).endDate
  };

  return <CardComponent { ...cardComponentProps }/>;
}

export default Card;
