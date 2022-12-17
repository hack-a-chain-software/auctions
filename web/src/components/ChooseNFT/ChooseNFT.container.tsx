import ChooseNFTComponent from './ChooseNFT.component';
import { useEffect, useState } from 'react';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { TokenTypes } from 'aptos';
import { useOnAccountNFTs } from '../../hooks/useOnAccountNFTs';
import { message } from 'antd';

type ChooseNFTProps = {
  openNFTSelector: boolean;
  setOpenNFTSelector: (open: boolean) => void;
  setSelectedNFT: (nft: TokenTypes.TokenDataId) => void;
};

function ChooseNFT(props: ChooseNFTProps) {
  const { account } = useWallet();
  const { list, fetch } = useOnAccountNFTs();

  const { openNFTSelector, setOpenNFTSelector, setSelectedNFT: passSelectedNFT } = props;
  const [listOfNFTs, setListOfNFTs] = useState<TokenTypes.TokenDataId[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<TokenTypes.TokenDataId|null>(null);

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
