import ChooseNFTComponent from './ChooseNFT.component';
import { RefObject, useEffect, useState } from 'react';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { NftItem } from 'contract_aptos';
import { useOnAccountNFTs } from '../../hooks/useOnAccountNFTs';
import { message } from 'antd';
import { useInfinityScroll } from '../../hooks/useInfinityScroll';

type ChooseNFTProps = {
  openNFTSelector: boolean;
  setOpenNFTSelector: (open: boolean) => void;
  setSelectedNFT: (nft: NftItem) => void;
};

function ChooseNFT(props: ChooseNFTProps) {
  const { account } = useWallet();
  const { list, fetch, loading } = useOnAccountNFTs();

  const { reference: listElement } = useInfinityScroll(80, fetchNFTs, loading);
  const { openNFTSelector, setOpenNFTSelector, setSelectedNFT: passSelectedNFT } = props;
  const [listOfNFTs, setListOfNFTs] = useState<NftItem[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NftItem|null>(null);

  useEffect(fetchNFTs, [account?.address]);

  useEffect(() => {
      setListOfNFTs(list);
  }, [list]);

  function fetchNFTs() {
    if(!account?.address)
      return;
    fetch(account.address, listOfNFTs.length);
  }

  function onSelectNFT() {
    if(!selectedNFT)
      return message.warning("You need to select one NFT.");
    passSelectedNFT(selectedNFT);
    setOpenNFTSelector(false);
  }

  const chooseNFTComponentProps = {
    openNFTSelector,
    setOpenNFTSelector,
    setSelectedNFT,
    onSelectNFT,
    listOfNFTs,
    listElement: listElement as RefObject<HTMLUListElement>
  };

  return <ChooseNFTComponent {...chooseNFTComponentProps}/>;
}

export default ChooseNFT;
