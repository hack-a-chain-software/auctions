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
  const { loading, hash, claimPrize, claimCoins } = useClaim(auctionCoin, id);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true);
  const { account, signAndSubmitTransaction } = useWallet();
  const { data } = useNFTData(creator, collection, name);
  const { bids } = useAuctionBids(`${id}`);
  const { info } = useCoinInfo(auctionCoin);
  const navigation = useNavigate();
  const getDate = useTimer;

  useEffect(() => {
    if(hash.length < 10)
      return;
    window.location.reload();
  }, [hash]);

  useEffect(() => {
    if(created && !live && new Big(currentBid).eq(0) && tokenClaimed)
      return setIsButtonEnabled(false);
    if(created && !live && !new Big(currentBid).eq(0) && coinsClaimed)
      return setIsButtonEnabled(false);
    setIsButtonEnabled(!loading);
  }, [loading]);

  const image = useMemo(() => {
    if(!data)
      return '';
    return data.uri;
  }, [data]);

  const live = new Date() < getDate(Number(endTime)).endDate;

  const iBided = useMemo(() => {
    if(!bids || !account?.address)
      return false;
    return bids.reduce((iDid: boolean, bid) => account.address === bid.account ? true : iDid, false);
  }, [bids]);

  const { symbol: currency } = useMemo(() => {
    if(!info)
      return { symbol: '' };
    return info;
  }, [info]);

  const bid = useMemo(() => {
    if(!info)
      return new Big(0);
    return formatDecimals(currentBid, info.decimals);
  }, [info]);

  function onButtonClick() {
    if(created && !live && new Big(currentBid).eq(0) && !tokenClaimed)
      return claimPrize(signAndSubmitTransaction);
    if(created && !live && !new Big(currentBid).eq(0) && !coinsClaimed)
      return claimCoins(signAndSubmitTransaction);
    navigation(`/auction/${id}`);
  }

  const cardComponentProps = {
    // If auction is closed of live
    live,
    // If the auction has no bids
    noBids: bid.eq(0),
    // If the logged account won the auction
    won: !live && !bid.eq(0) && account?.address === currentBidder,
    // If the logged account made an offer/bid
    iBided,
    // If the logged account has the highest offer/bid
    winning: iBided && account?.address === currentBidder,
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
    bid: bid.toFixed(3),
    currency,
    createdAt: getDate(Number(startTime)).endDate,
    closedAt: getDate(Number(endTime)).endDate
  };

  console.log(name, props);

  return <CardComponent { ...cardComponentProps }/>;
}

export default Card;
