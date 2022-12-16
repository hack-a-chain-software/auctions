import CardComponent from './Card.component';
import { Auction } from 'contract_aptos';
import { useNFTData } from '../../hooks/useNFTData';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { useAuctionBids } from '../../hooks/useAuctionBids';
import { useCoinInfo } from '../../hooks/useCoinInfo';

function Card(props: Auction) {
  const {
    id,
    creator: author,
    startTime,
    endTime,
    currentBid,
    currentBidder,
    auctionCoin,
    lockedTokenId: {
      token_data_id: {
        creator,
        collection,
        name
      }
    }
  } = props;
  const { account } = useWallet();
  const { data } = useNFTData(creator, collection, name);
  const { bids } = useAuctionBids(`${id}`);
  const { info } = useCoinInfo(auctionCoin);
  const navigation = useNavigate();

  const image = useMemo(() => {
    if(!data)
      return '';
    return data.uri;
  }, [data]);

  const isClose = new Date() > new Date(endTime);

  const firstPlace = useMemo(() => {
    if(!account?.address || typeof account.address !== 'string')
      return false;
    return account.address === currentBidder;
  }, [account]);

  const isOwner = useMemo(() => {
    if(!account?.address || typeof account.address !== 'string')
      return false;
    return account.address === author;
  }, [account]);

  const offered = useMemo(() => {
    if(!bids || !account?.address || typeof account.address !== 'string')
      return false;
    return bids.reduce((is: boolean, bid) => account.address === bid.account ? true : is, false);
  }, [bids]);

  const { symbol: currency } = useMemo(() => {
    if(!info)
      return { symbol: '' };
    return info;
  }, [info]);

  const cardComponentProps = {
    isClose,
    firstPlace,
    isWon: isClose && firstPlace,
    isOwner,
    offered,
    outbid: !isClose && !firstPlace,
    onButtonClick: () => navigation(`/auction/${id}`),
    isButtonEnabled: true,
    collection,
    name,
    image,
    closedAt: endTime,
    closingIn: endTime,
    owner: author,
    bid: currentBid,
    currency,
    createdAt: startTime,
  };

  return <CardComponent { ...cardComponentProps }/>;
}

export default Card;
