import NFTComponent from './NFT.component';
import { useEffect, useState } from 'react';
import { TokenTypes } from 'aptos';
import { useNFTData } from '../../hooks/useNFTData';

type NFTProps = TokenTypes.TokenDataId & {
  checked?: boolean
}

function NFT(props: NFTProps) {
  const { creator, collection, name } = props;
  const [image, setImage] = useState<string>('');
  const { data } = useNFTData(creator, collection, name);

  useEffect(() => {
    if(!data)
      return;
    setImage(data.uri);
  }, [data]);

  const chooseNFTComponentProps = {
    checked: !!props.checked,
    image,
    collection: props.collection,
    id: props.name
  };

  return <NFTComponent {...chooseNFTComponentProps}/>;
}

export default NFT;
