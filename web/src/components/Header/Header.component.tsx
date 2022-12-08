import {
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { WalletIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { Dialog, Transition, Popover } from "@headlessui/react";
import SpaceBitLogo27 from "../../assets/svg/SpaceBitLogo27";
import SpaceBitLogo38 from "../../assets/svg/SpaceBitLogo38";

function Header() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="bg-white flex flex-col justify-between items-center w-full mb-2 sticky top-0 backdrop-blur-sm bg-white/50 xl:px-32">
      <div className="flex justify-between items-center p-4 w-full">
        <Bars3Icon
          className="text-black w-8 md:hidden"
          onClick={() => setOpen(true)}
        />
        <div className="hidden md:flex items-center gap-4">
          <SpaceBitLogo38 />
          <h1 className="uppercase text-black tracking-[0.2rem] text-xl font-bold font-['Poppins']">
            Spacebit
          </h1>
        </div>
        <nav className="hidden md:flex">
          <ul className="flex gap-12 items-center">
            <li>
              <a
                href="#"
                className="text-black font-semibold text-sm tracking-tight"
              >
                Explore auctions
              </a>
            </li>
            <Popover as="li" className="relative">
              {({ open }) => (
                <>
                  <Popover.Button className="text-black font-semibold text-sm flex items-center gap-2 tracking-tight outline-none">
                    My auctions
                    <ChevronRightIcon
                      className={`text-black w-4 ${
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
                    <Popover.Panel className="flex flex-col bg-white items-start justify-center w-[179px] h-[141px] rounded-lg shadow-[0px_4px_20px_rgba(0,0,0,0.1)] p-4 absolute top-2 right-0">
                      <a
                        href="#"
                        className="text-black font-semibold text-sm w-full p-3 border-b-[1px] tracking-tight"
                      >
                        My offers
                      </a>
                      <a
                        href="#"
                        className="text-black font-semibold text-sm w-full p-3 tracking-tight"
                      >
                        Create auction
                      </a>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <li className="ml-10">
              <button
                type="button"
                className="bg-space flex justify-center items-center w-[150px] h-[40px] gap-2 text-sm font-bold rounded-md text-white"
              >
                <WalletIcon className="w-5 space-fill-white" /> Connect wallet
              </button>
            </li>
          </ul>
        </nav>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative md:hidden" onClose={setOpen}>
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
                      shadow-[0px_4px_15px_rgba(151,71,255,0.2)]
                      pointer-events-auto
                      relative w-60 h-[100vh] bg-white rounded-tr-lg rounded-br-lg  "
                    >
                      <div className="w-full flex p-4 items-center justify-between">
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
                        <ul className="flex flex-col gap-4 justify-center">
                          <li className="h-[30px] border-b-[1px] w-full px-6">
                            <a
                              href=""
                              className="text-black font-semibold text-sm"
                            >
                              Explore auctions
                            </a>
                          </li>
                          <Popover
                            as="li"
                            className="h-[30px] border-b-[1px] w-full px-6"
                          >
                            {({ open }) => (
                              <>
                                <Popover.Button className="text-black font-semibold text-sm flex items-center gap-4 outline-none">
                                  My auctions
                                  <ChevronRightIcon
                                    className={`text-black w-4 ${
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
                                  <Popover.Panel className="flex flex-col gap-1 mt-4">
                                    <a
                                      href="#"
                                      className="text-black font-semibold text-sm "
                                    >
                                      My offers
                                    </a>
                                    <a
                                      href="#"
                                      className="text-black font-semibold text-sm "
                                    >
                                      Create auction
                                    </a>
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
          <ul className="flex items-center gap-6">
            <li>
              <a href="#" className="text-black text-sm font-semibold">
                Explore auctions
              </a>
            </li>
            <li>
              <button
                type="button"
                className="bg-space flex items-center w-[150px] h-[32px] justify-center gap-2 text-sm font-bold rounded text-white  "
              >
                <WalletIcon className="w-5" /> Connect wallet
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex gap-4 justify-between w-[95%] max-w-[1224px] h-[40px] bg-input rounded-sm mt-6 mb-6 md:hidden">
        <MagnifyingGlassIcon className="text-gray-400 w-6 ml-4" />
        <input
          type="search"
          placeholder="Search for an auction"
          className="bg-transparent w-full text-black outline-none text-sm"
        />
      </div>
    </header>
  );
}

export default Header;
