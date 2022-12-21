import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { Dialog, Transition } from "@headlessui/react";
import { WalletIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";

type ConnectWalletProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

function ConnectWallet({ open, setOpen }: ConnectWalletProps) {
  const { wallets, connect } = useWallet();

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="
              w-[95%] max-w-[500px] px-5 pt-5 pb-[41px] transform overflow-hidden rounded-2xl bg-white transition-all mt-5 mb-5
              
            "
              >
                <div className="flex flex-col mb-8">
                  <Dialog.Title className="text-black text-4 font-bold tracking-tight flex justify-between">
                    <div className="flex gap-3">
                      <WalletIcon className="w-5" /> Connect Wallet
                    </div>
                    <XMarkIcon
                      className="w-5 cursor-pointer"
                      onClick={() => setOpen(false)}
                    />
                  </Dialog.Title>
                </div>

                <div className="space-y-6 flex flex-col">
                  {wallets.map(({ adapter }) => (
                    <button
                      key={"wallet-selector-modal-module" + adapter.name}
                      onClick={() =>
                        connect(adapter.name).then(() => setOpen(false))
                      }
                      className=" outline-none
                    rounded-md h-[78px] px-8 py-[17px] bg-white flex items-center shadow-sm shadow-sw-navbar
                    bg-[linear-gradient(90deg,_#474EFF_0px,_#9747FF_7px,_transparent_7px)] text-paragraph hover:scale-[1.05] transition-all
                  "
                    >
                      <img src={adapter.icon} className="w-8 mr-[30px]" />
                      <span className="font-bold text-xl">{adapter.name}</span>
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
export default ConnectWallet;
