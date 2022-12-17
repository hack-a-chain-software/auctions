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

type CardProps = Auction & {
  created?:boolean
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
    lockedTokenId: {
      token_data_id: {
        creator,
        collection,
        name
      }
    },
    created
  } = props;
  const { loading, claimPrize, claimCoins } = useClaim(id);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true);
  const { account, signAndSubmitTransaction } = useWallet();
  const { data } = useNFTData(creator, collection, name);
  const { bids } = useAuctionBids(`${id}`);
  const { info } = useCoinInfo(auctionCoin);
  const navigation = useNavigate();
  const getDate = useTimer;

  useEffect(() => {
    if(created && bids.length < 1)
      return setIsButtonEnabled(isClose && !loading);
    if(created && !coinsClaimed)
      return setIsButtonEnabled(isClose && !loading);
    setIsButtonEnabled(!loading);
  }, [account, bids, loading]);

  const image = useMemo(() => {
    if(!data)
      return '';
    return data.uri;
  }, [data]);

  const isClose = new Date() > getDate(Number(endTime)).endDate;

  const firstPlace = useMemo(() => {
    if(!account?.address)
      return false;
    return account.address === currentBidder && account.address !== author;
  }, [account]);

  const isOwner = useMemo(() => {
    if(!account?.address)
      return false;
    return account.address === author;
  }, [account]);

  const offered = useMemo(() => {
    if(!bids || !account?.address)
      return false;
    return bids.reduce((is: boolean, bid) => account.address === bid.account ? true : is, false);
  }, [bids]);

  const { symbol: currency } = useMemo(() => {
    if(!info)
      return { symbol: '' };
    return info;
  }, [info]);

  const bid = useMemo(() => {
    if(!info)
      return '0.000';
    return formatDecimals(currentBid, info.decimals).toFixed(3);
  }, [info]);

  function onButtonClick() {
    if(created && isClose && !coinsClaimed && !bids.length)
      return claimPrize(signAndSubmitTransaction);
    if(created && isClose && !coinsClaimed && bids.length)
      return claimCoins(signAndSubmitTransaction);
    navigation(`/auction/${id}`);
  }

  const cardComponentProps = {
    isClose,
    firstPlace,
    created: !!created,
    isWon: isClose && firstPlace,
    isOwner,
    offered,
    outbid: !isClose && !firstPlace,
    onButtonClick,
    isButtonEnabled,
    collection,
    name,
    image,
    closedAt: getDate(Number(endTime)).endDate,
    closingIn: getDate(Number(endTime)).endDate,
    owner: author,
    bid,
    hasBid: bids.length < 1,
    currency,
    createdAt: getDate(Number(startTime)).endDate,
  };

  return <CardComponent { ...cardComponentProps }/>;
}

export default Card;
