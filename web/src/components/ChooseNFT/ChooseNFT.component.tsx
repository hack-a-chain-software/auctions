import { Dialog, RadioGroup } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { RefObject } from 'react';
import NFT from '../NFT';
import { NftItem } from 'contract_aptos';

type ChooseNFTProps = {
  listElement: RefObject<HTMLUListElement>;
  openNFTSelector: boolean;
  setOpenNFTSelector: (open: boolean) => void;
  setSelectedNFT: (nft: NftItem) => void;
  onSelectNFT: () => void;
  listOfNFTs: NftItem[];
};

function ChooseNFTComponent({
  listElement,
  openNFTSelector,
  setOpenNFTSelector,
  setSelectedNFT,
  onSelectNFT,
  listOfNFTs
}: ChooseNFTProps) {
  return (
    <Dialog
      open={openNFTSelector}
      className="fixed inset-0 z-[55] flex justify-center items-center"
      onClose={setOpenNFTSelector}
    >
      <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-50" />
      <Dialog.Panel className="relative bg-white rounded-lg shadow shadow-sw overflow-hidden w-[95%] max-w-[620px] h-[443px]">
        <div className="w-full flex justify-between items-center px-9 pr-8 h-12 border-b-[1px]">
          <Dialog.Title className="text-black w-[76px] mt-1 text-sm font-semibold tracking-tight">
            Select NFTs
          </Dialog.Title>
          <button className="w-[22px] h-[22px] text-title mt-1">
            <XMarkIcon onClick={() => setOpenNFTSelector(false)} />
          </button>
        </div>
        <RadioGroup
          as="ul"
          ref={listElement}
          className="grid grid-cols-auto-fit pt-[1.9rem] px-6 justify-items-center gap-1 h-[323px] max-h-[323px] mb-2 overflow-y-auto"
          onChange={setSelectedNFT}
        >
          {listOfNFTs.map((item, key) => (
            <RadioGroup.Option
              as="li"
              className="h-[180px] relative cursor-pointer outline-none rounded-md hover:bg-space transition-all outline-none"
              value={item}
              key={key}
            >
              {({ checked }) => <NFT { ...item } checked={checked}/>}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
        <footer className="absolute w-full bottom-0 border-t-[1px] h-[73px] px-[1.9rem] py-4 flex justify-between">
          <button
            className="w-[120px] h-10 border-solid border-outline border-[1px] rounded-md p-2 tracking-tight text-text text-sm font-semibold hover:scale-[102%] transition"
            onClick={() => setOpenNFTSelector(false)}
          >
            Cancel
          </button>
          <button
            className="w-[112px] h-[35px] mt-1 bg-button rounded text-highlight text-sm hover:scale-[102%] transition-all"
            onClick={onSelectNFT}
          >
            Add to auction
          </button>
        </footer>
      </Dialog.Panel>
    </Dialog>
  );
}

export default ChooseNFTComponent;
