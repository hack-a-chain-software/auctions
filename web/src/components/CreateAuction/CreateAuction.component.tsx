import { Dialog, Transition, Popover, Combobox } from '@headlessui/react';
import { Fragment } from 'react';
import ChooseNFTSVG from '../../assets/svg/ChooseNFT';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { InputValid } from './CreateAuction.container';
import DateTimePicker from 'react-datetime-picker';
import './CreateAuction.styles.less';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import ChooseNFT from '../ChooseNFT';
import Big from 'big.js';
import { TokenTypes } from 'aptos';
import { CoinInfo } from 'contract_aptos';

type CreateAuctionComponentProps = {
  creatable: boolean,
  open: boolean,
  onClose: () => void
  openNFTSelector: boolean,
  setOpenNFTSelector: (open: boolean) => void,
  endDate: Date|undefined,
  setEndDate: (date: Date|undefined) => void,
  minOfferIncrement: Big,
  setMinOfferIncrement: (value: Big) => void,
  initialPrice: Big,
  setInitialPrice: (value: Big) => void,
  initialPriceAvailableCurrencies: CoinInfo[],
  initialPriceCurrency?: CoinInfo,
  initialPriceCurrencySelector: boolean,
  setInitialPriceCurrencySelector: (open: boolean) => void,
  setInitialPriceCurrency: (value: CoinInfo) => void,
  queryCurrencies: CoinInfo[],
  onQueryCurrencies: (value: string) => void,
  onCreateAuction: () => void,
  inputFail: InputValid,
  setInputFail: (status: InputValid) => void,
  selectedNFT: TokenTypes.TokenDataId|null,
  selectedNFTImage: string,
  setSelectedNFT: (nft: TokenTypes.TokenDataId) => void
}

function CreateAuctionComponent(props: CreateAuctionComponentProps) {
  const {
    open,
    onClose,
    creatable,
    endDate,
    setEndDate,
    minOfferIncrement,
    setMinOfferIncrement,
    initialPrice,
    setInitialPrice,
    initialPriceCurrency,
    setInitialPriceCurrencySelector,
    queryCurrencies,
    onQueryCurrencies,
    setInitialPriceCurrency,
    onCreateAuction,
    inputFail,
    setInputFail,
    selectedNFTImage,
} = props;

  function renderHeader() {
    return <div className="inset-0 flex justify-between items-center pl-4 sm:pl-6 pr-2.5 h-[67px] border-b-line border-b-[1px]">
      <h3 className="tracking leading-4 text-4 font-semibold">Create auction</h3>
      <button onClick={onClose} className="p-3 pr-[11px] self-start mt-[3px] hover:scale-[110%] hover:shadow-button" tabIndex={-1}>
        <XMarkIcon className="h-6 w-6"/>
      </button>
    </div>;
  }

  function renderNFTSelector() {
    const { openNFTSelector, setOpenNFTSelector, setSelectedNFT } = props;

    return <ChooseNFT 
            openNFTSelector={openNFTSelector} 
            setOpenNFTSelector={setOpenNFTSelector}
            setSelectedNFT={setSelectedNFT}
        />;
  }

  function renderImage() {
    const {
      setOpenNFTSelector,
      selectedNFT,
      inputFail: {
        nftInput
      }
    } = props;
    const nft = {
      creator: selectedNFT?.creator ? selectedNFT.creator : '',
      collection: selectedNFT?.collection ? selectedNFT.collection : '',
      name: selectedNFT?.name ? selectedNFT.name : ''
    };

    return <button className="w-full flex flex-col items-center pt-6 pb-14 outline-none"
                onClick={() => setOpenNFTSelector(true)}>
      { renderNFTSelector() }
      <div className={`w-min h-min rounded-sm ${ nftInput ? 'Fail' : '' }`}>
        { selectedNFT
          ? <img src={selectedNFTImage} alt={`${nft.collection} - ${nft.name}`} className="hover:transition-all hover:scale-[102%] hover:shadow-button"/>
          : <ChooseNFTSVG className="hover:transition-all hover:scale-[102%] hover:shadow-button"/>
        }
      </div>
      <span className={ nftInput ? 'block Fail-span' : 'hidden'}>Please choose a NFT to auction.</span>
    </button>
  }

  function renderEndDateInput() {
    const { dateInput } = inputFail;

    return <div className="flex flex-col">
      <h5 className="font-semibold text-3.5 leading-3.5 tracking mb-2">Auction end date</h5>
      <DateTimePicker value={endDate}
                  calendarIcon={null}
                  clearIcon={null}
                  format="y/MM/dd hh:mm a"
                  minDate={new Date()}
                  onChange={(date: Date) => {
                    setEndDate(date);
                    setInputFail({...inputFail, dateInput: date ? date < new Date() : true});
                  }}
                  dayPlaceholder="DD"
                  monthPlaceholder="MM"
                  yearPlaceholder="AAAA"
                  hourPlaceholder="HH"
                  minutePlaceholder="mm"
                  maxDetail="minute"
                  amPmAriaLabel="Select AM/PM"
                  className={(dateInput ? 'Fail' : '') + (endDate ? '' : ' placeholder')}/>
      <span className={ dateInput ? 'block Fail-span' : 'hidden'}>Please enter a date that is after today.</span>
    </div>;
  }

  function renderMinOfferIncrementInput() {
    const { minOfferIncrementInput } = inputFail;

    return <div className="flex flex-col mt-8">
      <h5 className="font-semibold text-3.5 leading-3.5 tracking mb-2">Minimum increment price</h5>
      <div className={`relative bg-input rounded-sm flex ${ minOfferIncrementInput ? 'Fail' : '' }`}>
        <input type="number"
               value={Number(minOfferIncrement.lte(0)) ? '' : minOfferIncrement.toFixed(2) }
               onChange={({ target: { value: price } }) => {
                 setMinOfferIncrement(new Big(price));
                 setInputFail({...inputFail, minOfferIncrementInput: new Big(price).lte(0)});
               }}
               min={0}
               step={0.01}
               className="Price"/>
      </div>
      <span className={ minOfferIncrementInput ? 'block Fail-span' : 'hidden'}>Please type a valid price, bigger than 0</span>
    </div>;
  }

  function renderInitialPriceCurrencySelector() {
    return <Popover className="sm:relative">
      {({open, close}) => <>
        <Transition
          show={open}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="Token">
            <Combobox value={ initialPriceCurrency }
                      onChange={ (value) => {
                        close();
                        setInitialPriceCurrency(value);
                        onQueryCurrencies('');

                      } }>
              <Combobox.Input
                className="Search"
                value=""
                placeholder="Search token"
                displayValue={ () => "" }
                onChange={ ({ target: { value: currency } }) => onQueryCurrencies(currency) }
              />
              <Combobox.Options className="List" static>
                { queryCurrencies.map((value, key) => (
                  <Combobox.Option className="Item" key={ key } value={ value }>
                    { () => <div>
                      { value.symbol }
                    </div> }
                  </Combobox.Option>
                )) }
              </Combobox.Options>
            </Combobox>
          </Popover.Panel>
        </Transition>
        <Popover.Button className="Button border-l-[1px]"
                        onClick={() => setInitialPriceCurrencySelector(true)}>
          <ChevronDownIcon className="h-3 w-3"/>
          { initialPriceCurrency?.symbol ? initialPriceCurrency.symbol : '' }
        </Popover.Button>
      </>}
    </Popover>
  }

  function renderPriceInput() {
    const { priceInput } = inputFail;

    return <div className="flex flex-col mt-8">
      <h5 className="font-semibold text-3.5 leading-3.5 tracking mb-2">Initial price</h5>
      <div className={`relative bg-input rounded-sm flex ${ priceInput ? 'Fail' : '' }`}>
        <input type="number"
               value={Number(initialPrice.lte(0)) ? '' : initialPrice.toFixed(2) }
               onChange={({ target: { value: price } }) => {
                 setInitialPrice(new Big(price));
                 setInputFail({...inputFail, priceInput: Number(price) <= 0});
               }}
               min={0}
               step={0.01}
               className="Price"/>
        { renderInitialPriceCurrencySelector() }
      </div>
      <span className={ priceInput ? 'block Fail-span' : 'hidden'}>Please type a valid price, bigger than 0</span>
    </div>
  }

  function renderFooter() {
    return <div className="inset-0 top-auto flex justify-between items-center mt-9 px-4 sm:px-6 h-[80px] border-t-outline border-t-[1px]">
      <button className="w-full sm:w-auto font-medium text-3.5 leading-3.5 text-highlight tracking bg-space rounded-md py-[.8125rem] px-[1.1875rem] hover:scale-[102%] hover:shadow-button disabled:mix-blend-darken" onClick={onCreateAuction} disabled={!creatable}>Create auction</button>
      <button className="hidden sm:block font-medium text-3.5 leading-3.5 text-caption tracking border-[1px] border-outline rounded-md py-[.8125rem] px-[2.34375rem] hover:scale-[102%] hover:shadow-button" onClick={onClose}>Cancel</button>
    </div>
  }

  return <Transition
    show={open}
    enter="transition duration-300 ease-out"
    enterFrom="translate-x-full"
    enterTo="translate-x-0"
    leave="transition duration-300 ease-out"
    leaveFrom="translate-x-0"
    leaveTo="translate-x-full"
    as={Fragment}
  >
    <Dialog onClose={onClose} className="CreateAuction fixed top-0 right-0 left-0 sm:left-auto h-screen sm:h-auto overflow-y-scroll sm:overflow-y-visible z-[13]">
      <Dialog.Backdrop className="fixed inset-0 z-[-1]" aria-hidden="true" />
      <Dialog.Panel className="bg-white rounded-bl-lg rounded-tl-lg shadow-md shadow-sw-md w-full sm:w-[637px]">
        { renderHeader() }
        { renderImage() }
        <div className="px-4 sm:px-[3.75rem]">
          { renderEndDateInput() }
          { renderMinOfferIncrementInput() }
          { renderPriceInput() }
        </div>
        { renderFooter() }
      </Dialog.Panel>
    </Dialog>
  </Transition>;
}

export default CreateAuctionComponent;