import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

function Modal({ open, onClose }: ModalProps) {
  return (
    <Dialog
      open={open}
      className="fixed inset-0 z-[55] flex justify-center items-center"
      onClose={onClose}
    >
      <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-50" />
      <Dialog.Panel className="relative bg-white rounded-[22px] shadow-2 overflow-hidden w-[95%] max-w-2xl shadow-[-1px_0px_16px_0px_rgba(0,0,0,0.21)]">
        <div className="w-full flex justify-between items-center pl-8 pr-6 h-12 border-b-[1px] ">
          <Dialog.Title className="text-black px-1 font-semibold tracking-tight">
            Select NFTs
          </Dialog.Title>
          <button className="w-[22px] h-[22px] text-black">
            <XMarkIcon />
          </button>
        </div>
        <ul className="grid grid-cols-auto-fit p-4 justify-items-center gap-6 max-h-[450px] overflow-y-auto">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <li className="relative">
              <img
                src="https://assets-global.website-files.com/5e73a1e3ba24f2cd5dd2232a/62f66985e6fa143898ba6762_Como%20criar%20um%20NFT%20(1)%20(1).jpg"
                alt=""
                className="w-[190px] h-[190px] object-cover rounded-[15px]"
              />
              <div className="flex justify-around flex-col absolute backdrop-blur-sm bg-white/30 bottom-2 rounded-[15px] w-[95%] left-1">
                <h3 className="text-black font-bold ml-4">Doodles</h3>
                <span className="text-black font-bold ml-4">#3333</span>
              </div>
            </li>
          ))}
        </ul>
        <footer className="border-t-[1px] px-8 py-4 flex justify-between">
          <button className="w-[130px] border-solid border-gray-300 border-[1px] rounded-[17px] p-2 text-gray-400 font-semibold">
            Cancel
          </button>
          <button className="w-[130px] bg-[#474EFF] rounded-[17px]">
            Add to auction
          </button>
        </footer>
      </Dialog.Panel>
    </Dialog>
  );
}

export default Modal;
