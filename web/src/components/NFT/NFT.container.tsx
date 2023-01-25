import NFTComponent from './NFT.component';
import { useEffect, useState } from 'react';
import { useNFTData } from '../../hooks/useNFTData';
import { NftItem } from 'contract_aptos';

import axios from "axios";

type NFTProps = NftItem & {
  checked?: boolean
}

function NFT(props: NFTProps) {
  const { creator, collectionName: collection, name } = props;
  const [image, setImage] = useState<string>('');
  const { data, fetch } = useNFTData();

  useEffect(() => {
    fetch(creator, collection, name);
  }, []);

  useEffect(() => {
    if (!data)
      return;
    axios.get<any>(data.uri)
      .then(val => {
        if (val.data.image) {
          setImage(val.data.image)
        } else {
          setImage(data.uri)
        }
      })
      .catch(_ => {
        setImage(data.uri)
      });

  }, [data]);

  const chooseNFTComponentProps = {
    checked: !!props.checked,
    image,
    collection,
    id: props.name
  };

  return <NFTComponent {...chooseNFTComponentProps} />;
}

export default NFT;
