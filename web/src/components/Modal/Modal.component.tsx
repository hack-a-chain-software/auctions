import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

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
      <Dialog.Panel className="relative bg-white rounded-lg shadow-md overflow-hidden w-[95%] max-w-[620px] h-[443px]">
        <div className="w-full flex justify-between items-center pl-8 pr-6 h-12 border-b-[1px] ">
          <Dialog.Title className="text-black px-1 text-sm font-semibold tracking-tight">
            Select NFTs
          </Dialog.Title>
          <button className="w-[22px] h-[22px] text-title">
            <XMarkIcon />
          </button>
        </div>
        <ul className="grid grid-cols-auto-fit p-4 justify-items-center gap-4 max-h-[310px] overflow-y-auto">
          {[1, 2, 3].map((item) => (
            <li className="relative">
              <img
                src="https://assets-global.website-files.com/5e73a1e3ba24f2cd5dd2232a/62f66985e6fa143898ba6762_Como%20criar%20um%20NFT%20(1)%20(1).jpg"
                alt=""
                className="w-[169px] h-[175px] object-cover rounded-md"
              />
              <div className="flex justify-around flex-col absolute backdrop-blur-cover bg-white/30 bottom-2 rounded h-[46px] w-[149px] left-[0.6rem]">
                <h3 className="text-black font-bold text-sm ml-4">Doodles</h3>
                <span className="text-black font-bold text-sm ml-4">#3333</span>
              </div>
            </li>
          ))}
        </ul>
        <footer className="absolute w-full bottom-0 border-t-[1px] h-[73px] px-8 py-4 flex justify-between">
          <button className="w-[120px] border-solid border-outline border-[1px] rounded-md p-2 text-text text-sm font-semibold">
            Cancel
          </button>
          <button className="w-[130px] bg-button rounded-md text-highlight text-sm">
            Add to auction
          </button>
        </footer>
      </Dialog.Panel>
    </Dialog>
  );
}

export default Modal;
