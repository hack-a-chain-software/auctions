import { Dialog, Transition, Popover, Combobox } from '@headlessui/react';
import { Fragment } from 'react';
import ChooseNFTSVG from '../../assets/svg/ChooseNFT';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { InputValid } from './CreateAuction.container';
import DatePicker from 'react-date-picker';
import './CreateAuction.styles.less';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import ChooseNFT from '../ChooseNFT';

type CreateAuctionComponentProps = {
  open: boolean,
  onClose: () => void
  openNFTSelector: boolean,
  setOpenNFTSelector: (open: boolean) => void,
  endDate: Date|undefined,
  setEndDate: (date: Date|undefined) => void,
  description: string,
  setDescription: (value: string) => void,
  initialPrice: string|number,
  setInitialPrice: (value: string|number) => void,
  initialPriceAvailableCurrencies: string[],
  initialPriceCurrency: string,
  initialPriceCurrencySelector: boolean,
  setInitialPriceCurrencySelector: (open: boolean) => void,
  setInitialPriceCurrency: (value: string) => void,
  queryCurrencies: string[],
  onQueryCurrencies: (value: string) => void,
  onCreateAuction: () => void,
  inputFail: InputValid,
  setInputFail: (status: InputValid) => void,
  selectedNFT: string,
  setSelectedNFT: (nft: string) => void
}

function CreateAuctionComponent(props: CreateAuctionComponentProps) {
  const {
    open,
    onClose,
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
    queryCurrencies,
    onQueryCurrencies,
    setInitialPriceCurrency,
    onCreateAuction,
    inputFail,
    setInputFail
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

    return <button className="w-full flex flex-col items-center pt-6 pb-14 outline-none"
                onClick={() => setOpenNFTSelector(true)}>
      { renderNFTSelector() }
      <div className={`w-min h-min rounded-sm ${ nftInput ? 'Fail' : '' }`}>
        { selectedNFT
            //TODO Add NFT info to load image
          ? <img src={selectedNFT/*.image*/} alt={selectedNFT/*.name*/} className="hover:transition-all hover:scale-[102%] hover:shadow-button"/>
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
      <DatePicker value={endDate}
                  calendarIcon={null}
                  clearIcon={null}
                  format="y/MM/dd"
                  minDate={new Date()}
                  onChange={(date: Date) => {
                    setEndDate(date);
                    setInputFail({...inputFail, dateInput: date ? date < new Date() : true});
                  }}
                  dayPlaceholder="DD"
                  monthPlaceholder="MM"
                  yearPlaceholder="AAAA"
                  className={(dateInput ? 'Fail' : '') + (endDate ? '' : ' placeholder')}/>
      <span className={ dateInput ? 'block Fail-span' : 'hidden'}>Please enter a date that is after today.</span>
    </div>;
  }

  function renderDescriptionInput() {
    const { descriptionInput } = inputFail;

    return <div className="flex flex-col mt-[2.5rem]">
      <h5 className="font-semibold text-3.5 leading-3.5 tracking mb-2">Description</h5>
      <textarea value={description}
                onChange={({target: { value: description }}) => {
                  setDescription(description);
                  setInputFail({...inputFail, descriptionInput: description.length < 30});
                }}
                className={`bg-input rounded-sm placeholder:text-placeholder outline-none p-4 h-20 ${descriptionInput ? 'Fail' : ''}`} />
      <span className={ descriptionInput ? 'block Fail-span' : 'hidden'}>Describe your nft auction (min: 30 characters)</span>
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
                { queryCurrencies.map(value => (
                  <Combobox.Option className="Item" key={ value } value={ value }>
                    { ({ selected, active }) => <div>
                      { value }
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
          { initialPriceCurrency }
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
               value={Number(initialPrice) <= 0 ? '' : initialPrice }
               onChange={({ target: { value: price } }) => {
                 setInitialPrice(price);
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
      <button className="w-full sm:w-auto font-medium text-3.5 leading-3.5 text-highlight tracking bg-space rounded-md py-[.8125rem] px-[1.1875rem] hover:scale-[102%] hover:shadow-button" onClick={onCreateAuction}>Create auction</button>
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
    <Dialog onClose={onClose} className="CreateAuction fixed top-0 right-0 left-0 sm:left-auto h-screen sm:h-auto overflow-y-scroll sm:overflow-y-visible z-[10]">
      <Dialog.Backdrop className="fixed inset-0 z-[-1]" aria-hidden="true" />
      <Dialog.Panel className="bg-white rounded-bl-lg rounded-tl-lg shadow-md shadow-sw-md w-full sm:w-[637px]">
        { renderHeader() }
        { renderImage() }
        <div className="px-4 sm:px-[3.75rem]">
          { renderEndDateInput() }
          { renderDescriptionInput() }
          { renderPriceInput() }
        </div>
        { renderFooter() }
      </Dialog.Panel>
    </Dialog>
  </Transition>;
}

export default CreateAuctionComponent;