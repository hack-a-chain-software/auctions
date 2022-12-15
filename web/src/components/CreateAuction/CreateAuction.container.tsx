import CreateAuctionComponent from './CreateAuction.component';
import { useEffect, useState } from 'react';
import { TokenData, TokenDataId, useAvailableCoins, useCreateAuction, useNFTData } from '../../hooks';
import { AptosAccount } from 'aptos';
import Big from 'big.js';
import { useWallet } from '@manahippo/aptos-wallet-adapter';

export type InputValid = {
  nftInput: boolean,
  dateInput: boolean,
  minOfferIncrementInput: boolean,
  priceInput: boolean
}

type CreateAuctionProps = {
  open?: boolean,
  setOpen?: (open: boolean) => void,
  onClose?: () => void
}

function CreateAuction(props: CreateAuctionProps) {
  const { open, setOpen, onClose } = props;

  const [creatable, setCreatable] = useState<boolean>(true);
  const [selectedNFT, setSelectedNFT] = useState<TokenDataId|null>(null);
  const [selectedNFTData, setSelectedNFTData] = useState<TokenData|null>(null);
  const [openNFTSelector, setOpenNFTSelector] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Date|undefined>(undefined);
  const [minOfferIncrement, setMinOfferIncrement] = useState<Big>(new Big(0));
  const [initialPrice, setInitialPrice] = useState<Big>(new Big(0));
  const [initialPriceCurrency, setInitialPriceCurrency] = useState<string>("");
  const [initialPriceCurrencySelector, setInitialPriceCurrencySelector] = useState<boolean>(false);
  const [initialPriceAvailableCurrencies, setInitialPriceAvailableCurrencies] = useState<string[]>([]);
  const [queryCurrencies, setQueryCurrencies] = useState<string[]>(initialPriceAvailableCurrencies);
  const [inputFail, setInputFail] = useState<InputValid>({
    nftInput: false,
    dateInput: false,
    minOfferIncrementInput: false,
    priceInput: false
  });
  const { account } = useWallet();

  let loading = false;

  useEffect(() => {
    if(loading)
      return;

    loading = true;
    useAvailableCoins().then(currencies => {
      setInitialPriceAvailableCurrencies(currencies);
      setInitialPriceCurrency(currencies.includes('ETH') ? 'ETH' : currencies[0]);
      loading = false;
    });
  }, []);

  useEffect(() => {
    if(!selectedNFT || loading)
      return;
    const { creator, collection, name } = selectedNFT;

    loading = true;
    useNFTData(creator, collection, name)
      .then(setSelectedNFTData)
      .then(() => loading = false);
  }, [selectedNFT]);

  function onQueryCurrencies(input: string) {
    if(!input || input === '')
      setQueryCurrencies(initialPriceAvailableCurrencies);
    setQueryCurrencies(initialPriceAvailableCurrencies
      .filter(currency => currency.toLowerCase().includes(input.toLowerCase()))
    );
  }

  function onCreateAuction() {
    if(!selectedNFT)
      inputFail.nftInput = true;
    if(!endDate || endDate <= new Date())
      inputFail.dateInput = true;
    if(minOfferIncrement.lte(0))
      inputFail.minOfferIncrementInput = true;
    if(initialPrice.lte(0))
      inputFail.priceInput = true;

    if(inputFail.dateInput || inputFail.nftInput || inputFail.minOfferIncrementInput || inputFail.priceInput)
      return setInputFail({...inputFail});

    setCreatable(false);
    if(!selectedNFT)
      return;

    useCreateAuction(
      new AptosAccount(undefined, account?.address ? account.address : ''),
      endDate ? endDate.getTime().toString() : '',
      new Big(initialPrice).toString(),
      new Big(minOfferIncrement).toString(),
      selectedNFT,
      initialPriceCurrency
    ).then(() => setCreatable(true));
  }

  const createAuctionProps = {
    creatable,
    open: open !== undefined ? open : true,
    onClose: onClose !== undefined ? onClose : setOpen !== undefined ? () => setOpen(false) : () => null,
    openNFTSelector,
    setOpenNFTSelector,
    endDate,
    setEndDate,
    minOfferIncrement,
    setMinOfferIncrement,
    initialPrice,
    setInitialPrice,
    initialPriceAvailableCurrencies,
    initialPriceCurrency,
    initialPriceCurrencySelector,
    setInitialPriceCurrencySelector,
    setInitialPriceCurrency,
    queryCurrencies,
    onQueryCurrencies,
    onCreateAuction,
    inputFail,
    setInputFail,
    selectedNFT,
    selectedNFTImage: selectedNFTData?.uri ? selectedNFTData.uri : '',
    setSelectedNFT
  };

  return <CreateAuctionComponent {...createAuctionProps} />
}

export default CreateAuction;