import ChooseNFTComponent from './ChooseNFT.component';
import { useEffect, useState } from 'react';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { NftItem } from 'contract_aptos';
import { useOnAccountNFTs } from '../../hooks/useOnAccountNFTs';
import { message } from 'antd';

type ChooseNFTProps = {
  openNFTSelector: boolean;
  setOpenNFTSelector: (open: boolean) => void;
  setSelectedNFT: (nft: NftItem) => void;
};

function ChooseNFT(props: ChooseNFTProps) {
  const { account } = useWallet();
  const { list, fetch } = useOnAccountNFTs();

  const { openNFTSelector, setOpenNFTSelector, setSelectedNFT: passSelectedNFT } = props;
  const [listOfNFTs, setListOfNFTs] = useState<NftItem[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NftItem|null>(null);

  useEffect(() => {
    if(!account?.address)
      return;
    fetch(account.address);
  }, [account?.address]);

  useEffect(() => {
      setListOfNFTs(list);
  }, [list]);

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
    listOfNFTs
  };

  return <ChooseNFTComponent {...chooseNFTComponentProps}/>;
}

export default ChooseNFT;
