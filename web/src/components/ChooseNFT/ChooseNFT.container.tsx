import ChooseNFTComponent from './ChooseNFT.component';
import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { TokenTypes } from 'aptos';
import { useOnAccountNFTs } from '../../hooks/useOnAccountNFTs';

type ChooseNFTProps = {
  openNFTSelector: boolean;
  setOpenNFTSelector: (open: boolean) => void;
  setSelectedNFT: (nft: TokenTypes.TokenDataId) => void;
};

function ChooseNFT(props: ChooseNFTProps) {
  const { openNFTSelector, setOpenNFTSelector, setSelectedNFT } = props;
  const [listOfNFTs, setListOfNFTs] = useState<TokenTypes.TokenDataId[]>([]);
  const { account } = useWallet();
  const { list } = useMemo(() => {
    if(!account?.address)
      return { list: [] };
    return useOnAccountNFTs(account.address);
  }, [account?.address]);

  useEffect(() => {
      setListOfNFTs(list);
  }, [list]);

  const chooseNFTComponentProps = {
    openNFTSelector,
    setOpenNFTSelector,
    setSelectedNFT,
    listOfNFTs
  };

  return <ChooseNFTComponent {...chooseNFTComponentProps}/>;
}

export default ChooseNFT;
