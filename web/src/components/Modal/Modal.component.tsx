import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { RadioGroup } from "@headlessui/react";

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
        <div className="w-full flex justify-between items-center px-9 pr-8 h-12 border-b-[1px] ">
          <Dialog.Title className="text-black w-[76px] mt-1 text-sm font-semibold tracking-tight">
            Select NFTs
          </Dialog.Title>
          <button className="w-[22px] h-[22px] text-title mt-1">
            <XMarkIcon />
          </button>
        </div>
        <RadioGroup
          as="ul"
          className="grid grid-cols-auto-fit pt-[1.9rem] px-6 justify-items-center gap-2 max-h-[290px] overflow-y-auto"
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <RadioGroup.Option
              as="li"
              className="relative cursor-pointer outline-none rounded-md hover:bg-space hover:shadow-[0px_4px_30px_rgba(71, 78, 255, 0.25)] transition-all outline-none"
              value={item}
              key={item}
            >
              {({ checked }) => (
                <>
                  <div
                    className={`p-[.17rem] w-[173px] ${
                      checked ? "bg-space" : "bg-transparent"
                    } rounded-md`}
                  >
                    <img
                      src="https://assets-global.website-files.com/5e73a1e3ba24f2cd5dd2232a/62f66985e6fa143898ba6762_Como%20criar%20um%20NFT%20(1)%20(1).jpg"
                      alt=""
                      className="w-[171px] h-[175px] object-cover rounded-[10px] hover:drop-shadow-xl outline-none"
                    />
                  </div>
                  <div className="flex flex-col justify-center absolute backdrop-blur-cover bg-white/80 bottom-3 rounded h-[46px] w-[149px] left-[0.8rem]">
                    <h3 className="text-black font-bold text-sm ml-4 tracking-tight ">
                      Doodles
                    </h3>
                    <span className="text-black font-bold text-sm ml-4 tracking-tight">
                      #3333
                    </span>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
        <footer className="absolute w-full bottom-0 border-t-[1px] h-[73px] px-[1.9rem] py-4 flex justify-between">
          <button className="w-[120px] h-10 border-solid border-outline border-[1px] rounded-md p-2 tracking-tight text-text text-sm font-semibold hover:scale-[102%] transition">
            Cancel
          </button>
          <button className="w-[112px]  h-[35px] mt-1 bg-button rounded text-highlight tracking-tight text-sm hover:scale-[102%] transition-all">
            Add to auction
          </button>
        </footer>
      </Dialog.Panel>
    </Dialog>
  );
}

export default Modal;
