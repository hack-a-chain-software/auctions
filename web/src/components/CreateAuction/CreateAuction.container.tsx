import CreateAuctionComponent from './CreateAuction.component';
import { useEffect, useState } from 'react';

export type InputValid = {
  nftInput: boolean,
  dateInput: boolean,
  descriptionInput: boolean,
  priceInput: boolean
}

type CreateAuctionProps = {
  open?: boolean,
  setOpen?: (open: boolean) => void,
  onClose?: () => void
}

function CreateAuction(props: CreateAuctionProps) {
  const { open, setOpen, onClose } = props;

  const [selectedNFT, setSelectedNFT] = useState<string>('');
  const [openNFTSelector, setOpenNFTSelector] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Date|undefined>(undefined);
  const [description, setDescription] = useState<string>("");
  const [initialPrice, setInitialPrice] = useState<string|number>(0);
  const [initialPriceCurrency, setInitialPriceCurrency] = useState<string>("ETH");
  const [initialPriceCurrencySelector, setInitialPriceCurrencySelector] = useState<boolean>(false);
  const [initialPriceAvailableCurrencies, setInitialPriceAvailableCurrencies] = useState<string[]>(['BTC', 'ETH', 'NEKO']);
  const [queryCurrencies, setQueryCurrencies] = useState<string[]>(initialPriceAvailableCurrencies);
  const [inputFail, setInputFail] = useState<InputValid>({
    nftInput: false,
    dateInput: false,
    descriptionInput: false,
    priceInput: false
  });

  useEffect(() => {
    // TODO Add here the loader for available currencies
    //  setInitialPriceAvailableCurrencies(['BTC', 'ETH', 'NEKO'])
    //  setInitialPriceCurrency('ETH')
  }, []);

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
    if(description.length < 30)
      inputFail.descriptionInput = true;
    if(initialPrice <= 0)
      inputFail.priceInput = true;

    console.log(inputFail);
    if(inputFail.dateInput || inputFail.nftInput || inputFail.descriptionInput || inputFail.priceInput)
      return setInputFail({...inputFail});

    alert('Create Auction');
  }

  const createAuctionProps = {
    open: open !== undefined ? open : true,
    onClose: onClose !== undefined ? onClose : setOpen !== undefined ? () => setOpen(false) : () => null,
    openNFTSelector,
    setOpenNFTSelector,
    endDate,
    setEndDate,
    description,
    setDescription,
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
    setSelectedNFT
  };

  return <CreateAuctionComponent {...createAuctionProps} />
}

export default CreateAuction;