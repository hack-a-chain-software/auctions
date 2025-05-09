import CreateAuctionComponent from './CreateAuction.component';
import { useEffect, useState } from 'react';
import { TokenTypes } from 'aptos';
import Big from 'big.js';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { useAvailableCoins } from '../../hooks/useAvailableCoins';
import { useNFTData } from '../../hooks/useNFTData';
import { useCreateAuction } from '../../hooks/useCreateAuction';
import { CoinInfo, NftItem } from 'contract_aptos';
import { formatInteger } from '../../utils/formatInteger';

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
  const [selectedNFT, setSelectedNFT] = useState<NftItem|null>(null);
  const [selectedNFTData, setSelectedNFTData] = useState<TokenTypes.TokenData|null>(null);
  const [openNFTSelector, setOpenNFTSelector] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Date|undefined>(undefined);
  const [minOfferIncrement, setMinOfferIncrement] = useState<Big>(new Big(0));
  const [initialPrice, setInitialPrice] = useState<Big>(new Big(0));
  const [initialPriceCurrency, setInitialPriceCurrency] = useState<(CoinInfo & {type: string})>();
  const [initialPriceCurrencySelector, setInitialPriceCurrencySelector] = useState<boolean>(false);
  const [initialPriceAvailableCurrencies, setInitialPriceAvailableCurrencies] = useState<(CoinInfo & {type: string})[]>([]);
  const [queryCurrencies, setQueryCurrencies] = useState<(CoinInfo & {type: string})[]>(initialPriceAvailableCurrencies);
  const [inputFail, setInputFail] = useState<InputValid>({
    nftInput: false,
    dateInput: false,
    minOfferIncrementInput: false,
    priceInput: false
  });
  const { signAndSubmitTransaction } = useWallet();
  const { coins: currencies } = useAvailableCoins();
  const { data, fetch } = useNFTData();
  const { create, loading: creating } = useCreateAuction();

  useEffect(() => {
    if(!currencies)
      return;
    setInitialPriceAvailableCurrencies(currencies);
    setQueryCurrencies(currencies);
    const defaultCurrency = currencies.find(currency => currency.symbol === 'ETH');
    setInitialPriceCurrency(defaultCurrency ? defaultCurrency : currencies[0]);
  }, [currencies]);

  useEffect(() => {
    setCreatable(!creating);
  }, [creating]);

  useEffect(() => {
    if(!selectedNFT)
      return;
    fetch(selectedNFT.creator, selectedNFT.collectionName, selectedNFT.name);
  }, [selectedNFT]);

  useEffect(() => {
    if(!data)
      return;
    setSelectedNFTData(data);
  }, [data]);

  function onQueryCurrencies(input: string) {
    if(!input || input === '')
      setQueryCurrencies(initialPriceAvailableCurrencies);
    setQueryCurrencies(initialPriceAvailableCurrencies
      .filter(currency => currency.symbol.toLowerCase().includes(input.toLowerCase()))
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

    if(!selectedNFT || !initialPriceCurrency)
      return;

    create(
      signAndSubmitTransaction,
      endDate ? endDate.getTime().toString()+'000' : '',
      formatInteger(initialPrice.toString(), initialPriceCurrency.decimals).toString(),
      formatInteger(minOfferIncrement.toString(), initialPriceCurrency.decimals).toString(),
      selectedNFT,
      initialPriceCurrency.type
    );
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