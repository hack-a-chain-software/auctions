import CreateAuctionComponent from './CreateAuction.component';
import { useState } from 'react';

export type InputValid = {
  nftInput: boolean,
  dateInput: boolean,
  descriptionInput: boolean,
  priceInput: boolean
}

function CreateAuction() {
  const [open, setOpen] = useState<boolean>(true);
  const [selectedNFT, setSelectedNFT] = useState<string>('');
  const [openSelector, setOpenSelector] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Date|null>(null);
  const [description, setDescription] = useState<string>("");
  const [initialPrice, setInitialPrice] = useState<string|number>(0);
  const [initialPriceCurrency, setInitialPriceCurrency] = useState<string>("");
  const [initialPriceAvailableCurrencies, setInitialPriceAvailableCurrencies] = useState<string[]>(['BTC', 'ETH', 'NEKO']);
  const [inputFail, setInputFail] = useState<InputValid>({
    nftInput: false,
    dateInput: false,
    descriptionInput: false,
    priceInput: false
  });

  function onInitialPriceCurrencySelect(selected: string) {
    setInitialPriceCurrency(selected);
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
    open,
    onClose: () => setOpen(false),
    openSelector,
    setOpenSelector,
    endDate,
    setEndDate,
    description,
    setDescription,
    initialPrice,
    setInitialPrice,
    initialPriceAvailableCurrencies,
    onInitialPriceCurrencySelect,
    onCreateAuction,
    inputFail,
    setInputFail,
    selectedNFT,
    setSelectedNFT
  };

  return <CreateAuctionComponent {...createAuctionProps} />
}

export default CreateAuction;