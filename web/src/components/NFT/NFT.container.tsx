import NFTComponent from './NFT.component';
import { useEffect, useState } from 'react';
import { TokenDataId, useNFTData } from '../../hooks';

type NFTProps = TokenDataId & {
  checked?: boolean
}

function NFT(props: NFTProps) {
  const [image, setImage] = useState<string>('');
  let loading = false;

  useEffect(() => {
    if(loading)
      return;
    const { creator, collection, name } = props;

    loading = true;
    useNFTData(creator, collection, name)
      .then(data => setImage(data.uri))
      .then(() => loading = false);
  }, []);

  const chooseNFTComponentProps = {
    checked: !!props.checked,
    image,
    collection: props.collection,
    id: props.name
  };

  return <NFTComponent {...chooseNFTComponentProps}/>;
}

export default NFT;
