import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ChooseNFTSVG from '../../assets/svg/ChooseNFT';
import { ItemDataType } from 'rsuite/esm/@types/common';
import { DatePicker, Input, InputGroup, InputNumber, SelectPicker}  from 'rsuite';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { InputValid } from './CreateAuction.container';


type CreateAuctionComponentProps = {
  open: boolean,
  onClose: () => void
  openSelector: boolean,
  setOpenSelector: (open: boolean) => void,
  endDate: Date|null,
  setEndDate: (date: Date|null) => void,
  description: string,
  setDescription: (value: string) => void,
  initialPrice: string|number,
  setInitialPrice: (value: string|number) => void,
  initialPriceAvailableCurrencies: string[],
  onInitialPriceCurrencySelect: (value: string) => void,
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
    onInitialPriceCurrencySelect,
    onCreateAuction,
    inputFail,
    setInputFail
} = props;

  function renderHeader() {
    return <div className="inset-0 flex justify-between items-center pl-6 pr-2.5 h-[67px] border-b-line border-b-[1px]">
      <h3 className="tracking leading-4 text-4 font-semibold">Create auction</h3>
      <button onClick={onClose} className="p-3 pr-[11px] self-start mt-[3px] hover:scale-[110%] hover:shadow-button" tabIndex={-1}>
        <XMarkIcon className="h-6 w-6"/>
      </button>
    </div>;
  }

  function renderNFTSelector() {
    const { openSelector, setOpenSelector, setSelectedNFT } = props;

    //TODO AUC-6 Add modal choose NFT
    return <></>;
  }

  function renderImage() {
    const {
      setOpenSelector,
      selectedNFT,
      inputFail: {
        nftInput
      }
    } = props;

    return <button className="input w-full flex flex-col items-center pt-6 pb-14 outline-none"
                onClick={() => setOpenSelector(true)}>
      { renderNFTSelector() }
      <div className={`w-min h-min rounded-sm ${ nftInput ? 'fail' : '' }`}>
        { selectedNFT
            //TODO Add NFT info to load image
          ? <img src={selectedNFT/*.image*/} alt={selectedNFT/*.name*/} className="hover:transition-all hover:scale-[102%] hover:shadow-button"/>
          : <ChooseNFTSVG className="hover:transition-all hover:scale-[102%] hover:shadow-button"/>
        }
      </div>
      <span className={ nftInput ? 'block fail-span' : 'hidden'}>Please choose a NFT to auction.</span>
    </button>
  }

  function renderEndDateInput() {
    const { dateInput } = inputFail;

    return <div className="input flex flex-col">
      <h5 className="font-semibold text-3.5 leading-3.5 tracking mb-2">Auction end date</h5>
      <DatePicker value={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                    setInputFail({...inputFail, dateInput: date ? date < new Date() : true});
                  }}
                  oneTap
                  caretAs={() => null}
                  format="dd/MM/yyyy"
                  placeholder="DD/MM/AAAA"
                  disabledDate={(date) => date ? date < new Date() : true}
                  className={`bg-input rounded-sm text-3 leading-3 ${dateInput ? 'fail' : ''}`}/>
      <span className={ dateInput ? 'block fail-span' : 'hidden'}>Please enter a date that is after today.</span>
    </div>;
  }

  function renderDescriptionInput() {
    const { descriptionInput } = inputFail;

    return <div className="input flex flex-col mt-[2.5rem]">
      <h5 className="font-semibold text-3.5 leading-3.5 tracking mb-2">Description</h5>
      <Input className={`bg-input rounded-sm placeholder:text-placeholder max-h-20 ${descriptionInput ? 'fail' : ''}`}
             as="textarea"
             rows={6}
             value={description}
             onChange={(description) => {
               setDescription(description);
               setInputFail({...inputFail, descriptionInput: description.length < 30});
             }} />
      <span className={ descriptionInput ? 'block fail-span' : 'hidden'}>Please describe your nft auction with at least 30 characters</span>
    </div>;
  }
  
  function renderInitialPriceCurrencySelector() {
    return <SelectPicker data={initialPriceAvailableCurrencies.map(value => ({label: value, value: value} as ItemDataType<string>))}
                         onSelect={onInitialPriceCurrencySelect}
                         placement="autoHorizontalStart"
                         defaultValue="ETH"
                         menuClassName="input-selector"
                         menuAutoWidth={false}
                         cleanable={false}
                         menuMaxHeight={125}/>
  }

  function renderPriceInput() {
    const { priceInput } = inputFail;

    return <div className="input flex flex-col mt-8">
      <h5 className="font-semibold text-3.5 leading-3.5 tracking mb-2">Initial price</h5>
      <InputGroup className={`bg-input rounded-sm ${ priceInput ? 'fail' : '' }`}>
        <InputNumber value={initialPrice ? initialPrice : ''}
                     className="placeholder:text-placeholder"
                     onChange={(price) => {
                       setInitialPrice(price);
                       setInputFail({...inputFail, priceInput: Number(price) <= 0});
                     }}
                     min={0}
                     step={ .01 }/>
        { renderInitialPriceCurrencySelector() }
      </InputGroup>
      <span className={ priceInput ? 'block fail-span' : 'hidden'}>Please type a valid price, bigger than 0</span>
    </div>
  }

  function renderFooter() {
    return <div className=" inset-0 top-auto flex justify-between items-center mt-9 px-6 h-[80px] border-t-outline border-t-[1px]">
      <button className="font-medium text-3.5 leading-3.5 text-highlight tracking bg-space rounded-md py-[.8125rem] px-[1.1875rem] hover:scale-[102%] hover:shadow-button" onClick={onCreateAuction}>Create auction</button>
      <button className="font-medium text-3.5 leading-3.5 text-caption tracking border-[1px] border-outline rounded-md py-[.8125rem] px-[2.34375rem] hover:scale-[102%] hover:shadow-button" onClick={onClose}>Cancel</button>
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
    <Dialog onClose={onClose} className="fixed top-0 right-0">
      <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-[-1]" aria-hidden="true" />
      <Dialog.Panel className="bg-white rounded-bl-lg rounded-tl-lg shadow-md w-[637px]">
        { renderHeader() }
        { renderImage() }
        <div className="px-[3.75rem]">
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