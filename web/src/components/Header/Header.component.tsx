import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { WalletIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Popover } from "@headlessui/react";
import { useNavigate } from "react-router";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import SpaceBitLogo27 from "../../assets/svg/SpaceBitLogo27";
import SpaceBitLogo38 from "../../assets/svg/SpaceBitLogo38";
import ConnectWallet from "../ConnectWallet";

function Header() {
  const [open, setOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { connected, disconnect } = useWallet();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    function delayButtonRender() {
      setTimeout(function () {
        setLoading(false);
      }, 100);
    }
    delayButtonRender();
  }, [connected]);

  return (
    <>
      <header className="bg-white flex flex-col justify-between items-center w-full mb-2 md:h-20 sticky top-0 z-[11] backdrop-blur-sm bg-white/50 xl:px-14 xl:pl-20 xl:py-2">
        <div className="flex justify-between items-center p-3 pr-7 pl-5 w-full">
          <Bars3Icon
            className="text-black w-6 md:hidden"
            onClick={() => setOpen(true)}
          />
          <div
            className="hidden md:flex items-center gap-4 pl-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <SpaceBitLogo38 />
            <h1 className="uppercase text-black tracking-[.2rem] text-xl font-bold font-['Poppins']">
              Spacebit
            </h1>
          </div>
          <nav className="hidden md:flex">
            <ul className="flex gap-11 items-center">
              <li className="pb-1 md:pb-0">
                <span
                  onClick={() => navigate("/")}
                  className="text-black font-semibold text-sm tracking-tight cursor-pointer"
                >
                  Explore auctions
                </span>
              </li>
              <Popover as="li" className="relative pr-8">
                <Popover.Button className="text-black font-semibold text-sm flex items-center tracking-tight outline-none gap-3">
                  <span className="text-black font-semibold text-sm tracking-tight">
                    My auctions
                  </span>
                  <ChevronDownIcon className="text-black w-4" />
                </Popover.Button>

                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Popover.Panel className="flex flex-col bg-white items-start justify-center w-[179px] h-[141px] rounded-lg shadow shadow-sw-sm p-3 absolute top-2 right-0">
                    <span
                      onClick={() => navigate("/my-auctions/offer-live")}
                      className="text-black font-semibold text-sm w-full p-3 border-b-[1px] tracking-tight cursor-pointer"
                    >
                      My offers
                    </span>
                    <span
                      onClick={() => navigate("/my-auctions/your-live")}
                      className="text-black font-semibold text-sm w-full p-3 tracking-tight cursor-pointer"
                    >
                      Create auction
                    </span>
                  </Popover.Panel>
                </Transition>
              </Popover>

              <li className="pr-7">
                <button
                  type="button"
                  className="bg-space flex justify-center items-center w-[155px] h-10 gap-2 text-sm font-bold rounded-md text-white tracking-tight"
                  onClick={() => {
                    if (connected) {
                      localStorage.removeItem("WalletConnected");
                      disconnect();
                    } else {
                      setShowModal(true);
                    }
                  }}
                >
                  {" "}
                  {!loading && (
                    <>
                      <WalletIcon className="w-5 text-caption" />{" "}
                      {connected ? "Disconnect" : "Connect wallet"}
                    </>
                  )}
                </button>
              </li>
            </ul>
          </nav>
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-[12] md:hidden"
              onClose={setOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 left-0 flex">
                    <Transition.Child
                      as={Fragment}
                      enter="transform transition ease-in-out duration-500 sm:duration-700"
                      enterFrom="translate-x-[-200px]"
                      enterTo="translate-x-0"
                      leave="transform transition ease-in-out duration-500 sm:duration-700"
                      leaveFrom="translate-x-0"
                      leaveTo="translate-x-[-250px]"
                    >
                      <Dialog.Panel
                        className="
                      w-[257px]
                      shadow
                      shadow-sw-navbar
                      pointer-events-auto
                      relative w-60 h-screen bg-white rounded-tr-lg rounded-br-lg"
                      >
                        <div className="w-full h-[55px] flex p-4 px-5 items-center justify-between">
                          <button
                            type="button"
                            className="text-black hover:text-white focus:outline-none"
                            onClick={() => setOpen(false)}
                          >
                            <XMarkIcon
                              className="h-6 w-6 text-black"
                              aria-hidden="true"
                            />
                          </button>
                          <SpaceBitLogo27 />
                        </div>
                        <nav>
                          <ul className="flex flex-col gap-3 mt-4 justify-center tracking-tight">
                            <li className="h-[35px] border-b-[2px] w-full px-[1.6rem]">
                              <span
                                onClick={() => navigate("/")}
                                className="text-black font-semibold text-sm cursor-pointer"
                              >
                                Explore auctions
                              </span>
                            </li>
                            <Popover
                              as="li"
                              className="h-[35px] border-b-[2px] w-full px-6"
                            >
                              {({ open }) => (
                                <>
                                  <Popover.Button className="text-black font-semibold text-sm flex items-center gap-5 outline-none tracking-tight mt-[.1rem]">
                                    My auctions
                                    <ChevronRightIcon
                                      className={`text-black w-[13px] ${
                                        open ? "rotate-90 transform" : ""
                                      }`}
                                    />
                                  </Popover.Button>
                                  <Transition
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                  >
                                    <Popover.Panel className="flex flex-col gap-2 mt-7">
                                      <span
                                        onClick={() =>
                                          navigate("/my-auctions/offer-live")
                                        }
                                        className="text-black font-semibold text-sm tracking-tight outline-none cursor-pointer"
                                      >
                                        My offers
                                      </span>
                                      <span
                                        onClick={() =>
                                          navigate("/my-auctions/your-live")
                                        }
                                        className="text-black font-semibold text-sm tracking-tight outline-none cursor-pointer"
                                      >
                                        Create auction
                                      </span>
                                    </Popover.Panel>
                                  </Transition>
                                </>
                              )}
                            </Popover>
                          </ul>
                        </nav>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
          <nav className="md:hidden">
            <ul className="flex items-center gap-14">
              <li>
                <span
                  onClick={() => navigate("/")}
                  className="text-paragraph text-sm font-semibold tracking-normal cursor-pointer"
                >
                  Explore auctions
                </span>
              </li>
              <li className="mr-[-4px]">
                <button
                  type="button"
                  className="bg-space flex items-center w-[150px] h-8 justify-center gap-2 ml-1 text-sm font-bold rounded text-white"
                  onClick={() => {
                    if (connected) {
                      localStorage.removeItem("WalletConnected");
                      disconnect();
                    } else {
                      setShowModal(true);
                    }
                  }}
                >
                  {!loading && (
                    <>
                      <WalletIcon className="w-5 text-caption" />{" "}
                      {connected ? "Disconnect" : "Connect wallet"}
                    </>
                  )}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <ConnectWallet setOpen={setShowModal} open={showModal} />
    </>
  );
}

export default Header;
