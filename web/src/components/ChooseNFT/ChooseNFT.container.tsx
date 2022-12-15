import ChooseNFTComponent from './ChooseNFT.component';
import { useEffect, useState } from 'react';
import { TokenDataId, useOnAccountNFTs } from '../../hooks';
import { useWallet } from '@manahippo/aptos-wallet-adapter';

type ChooseNFTProps = {
  openNFTSelector: boolean;
  setOpenNFTSelector: (open: boolean) => void;
  setSelectedNFT: (nft: TokenDataId) => void;
};

function ChooseNFT(props: ChooseNFTProps) {
  const { openNFTSelector, setOpenNFTSelector, setSelectedNFT } = props;
  const [listOfNFTs, setListOfNFTs] = useState<TokenDataId[]>([]);
  const { account } = useWallet();
  let loading = false;

  useEffect(() => {
    if(!account?.address || loading)
      return;

    loading = true;
    useOnAccountNFTs(account.address)
      .then(setListOfNFTs)
      .then(() => loading = false);
  }, []);

  const chooseNFTComponentProps = {
    openNFTSelector,
    setOpenNFTSelector,
    setSelectedNFT,
    listOfNFTs
  };

  return <ChooseNFTComponent {...chooseNFTComponentProps}/>;
}

export default ChooseNFT;
