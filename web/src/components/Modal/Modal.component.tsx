import { Dialog } from "@headlessui/react";

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
      <Dialog.Panel className="relative bg-white rounded-lg shadow-2 overflow-hidden w-[95%] max-w-3xl">
        <div className="w-full shadow-[0_4px_20px_#FFF] flex justify-between items-center pl-8 pr-6 h-12 border-b-[1px]">
          <Dialog.Title className="text-black px-1 font-semibold tracking-tight">
            Select NFTs
          </Dialog.Title>
          <button className="w-[50px] h-[50px] text-black">X</button>
        </div>
        <ul className="grid grid-cols-auto-fit p-4 justify-items-center gap-6 max-h-[450px] overflow-y-auto">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <li className="relative">
              <img
                src="https://assets-global.website-files.com/5e73a1e3ba24f2cd5dd2232a/62f66985e6fa143898ba6762_Como%20criar%20um%20NFT%20(1)%20(1).jpg"
                alt=""
                className="h-[190px] object-cover rounded-[15px]"
              />
              <div className="flex justify-around flex-col absolute backdrop-blur-sm bg-white/30 bottom-2 rounded-[15px] w-[95%] left-1">
                <h3 className="text-black font-bold ml-4">Doodles</h3>
                <span className="text-black font-bold ml-4">#3333</span>
              </div>
            </li>
          ))}
        </ul>
        <footer className="border-t-[1px] px-8 py-4 flex justify-between">
          <button className="w-[120px] border-solid border-gray-300 border-[1px] rounded-[10px] p-2 text-gray-400 font-semibold">
            Cancel
          </button>
          <button className="w-[120px] bg-[#474EFF] rounded-[10px]">
            Add to raffle
          </button>
        </footer>
      </Dialog.Panel>
    </Dialog>
  );
}

export default Modal;
