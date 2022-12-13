import {
  ChevronLeftIcon,
  ListBulletIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import CrownIcon from "../../assets/svg/CrownIcon";
import PageContainer from "../../components/PageContainer";

function Auction() {
  const offered = false;
  const firstPlace = false;
  const closedAuction = false;
  const isWon = false;

  function renderDefautOfferState() {
    return (
      <div
        className={`mt-8 max-w-[413px] border-solid border-[1px] rounded-lg border-outline bg-white mx-auto  md:max-w-full xl:max-w-[761px]`}
      >
        <div className="flex items-center h-[52px] border-b-[1px] xl:h-[55px]">
          <h3 className="px-4 flex items-center gap-2 font-semibold text-black tracking-tight text-md xl:px-6">
            <ListBulletIcon className="w-6" /> Offers
          </h3>
        </div>
        <div className={`p-6 flex justify-between overflow-y-auto`}>
          <div>
            <p className="text-md font-medium tracking-tight mb-7">Price</p>
            {[1, 2, 3, 4, 5].map((item) => {
              return (
                <p className="md:text-xl font-semibold tracking-tight text-black h-[3.75rem]">
                  0,32 ETH
                </p>
              );
            })}
          </div>
          <div className="xl:w-[270px]">
            <p className="text-md font-medium tracking-tight mb-7">From</p>
            {[1, 2, 3, 4, 5].map((item) => {
              return (
                <p
                  className="md:text-xl font-semibold h-[3.75rem] tracking-tight text-black w-[100px] truncate leading-6"
                  title="@Userta12348545"
                >
                  @Usertal1354645
                </p>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function renderFirstPlaceOfferState() {
    return (
      <div
        className={`mt-8 max-w-[413px] border-solid border-[1px] rounded-lg border-outline bg-white mx-auto xl:max-w-[761px]`}
      >
        <div className="flex items-center h-[52px] border-b-[1px] xl:h-[55px]">
          <h3 className="px-4 flex items-center gap-2 font-semibold text-black tracking-tight text-md xl:px-6">
            <ListBulletIcon className="w-7" /> Offers
          </h3>
        </div>
        <div className={`p-6 flex justify-between overflow-y-auto`}>
          <div>
            <span className="text-md font-medium tracking-teight mb-7">
              Price
            </span>
            {[1, 2, 3, 4, 5].map((item) => {
              if (item === 1) {
                return (
                  <p className="md:text-xl font-semibold tracking-tight text-black h-[3.75rem]">
                    0,32 ETH <CrownIcon />
                  </p>
                );
              }

              return (
                <p className="md:text-xl font-semibold tracking-tight text-black h-[3.75rem]">
                  0,32 ETH
                </p>
              );
            })}
          </div>
          <div className="xl:w-[270px]">
            <span className="text-md font-medium tracking-tight mb-7">
              From
            </span>
            {[1, 2, 3, 4, 5].map((item) => {
              if (item === 1) {
                return (
                  <p
                    className="md:text-xl font-semibold h-[3.75rem] tracking-tight text-black w-[100px] truncate leading-6"
                    title="@Usertal1354645"
                  >
                    @Usertal1354645
                  </p>
                );
              }
              return (
                <p
                  className="md:text-xl font-semibold h-[3.75rem] tracking-tight text-black w-[100px] truncate leading-6"
                  title="@Usertal1354645"
                >
                  @Usertal1354645
                </p>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function renderOffersWinState() {
    return (
      <div
        className={`mt-8 max-w-[413px] border-solid border-[1px] rounded-lg border-outline bg-white mx-auto  xl:max-w-[761px]`}
      >
        <div className="flex items-center h-[52px] border-b-[1px] xl:h-[55px]">
          <h3 className="px-4 flex items-center gap-2 font-semibold text-black tracking-tight text-md xl:px-6">
            <ListBulletIcon className="w-7" /> Offers
          </h3>
        </div>
        <div className={`p-6 flex justify-between`}>
          <div>
            <span className="text-md font-medium tracking-teight mb-7">
              Price
            </span>
            {[1, 2, 3, 4, 5, 6].map((item) => {
              // item === 1 (primeiro lugar ate puxar os dados corretos)
              if ((item === 1 && isWon) || (item === 1 && closedAuction)) {
                return (
                  <div className="relative mt-1">
                    <p className="absolute bottom-7 text-transparent bg-clip-text bg-space max-w-[419px] flex gap-2 text-sm font-semibold items-center">
                      <CrownIcon /> Winner
                    </p>
                    <p
                      className={`md:text-xl ${
                        isWon || closedAuction ? "font-bold" : "font-semibold"
                      } tracking-tight text-success h-[3.75rem]`}
                    >
                      0,35 ETH
                    </p>
                  </div>
                );
              }
              return (
                <p className="md:text-xl font-semibold tracking-tight text-black h-[3.75rem]">
                  0,32 ETH
                </p>
              );
            })}
          </div>
          <div className="xl:w-[270px]">
            <span className="text-md font-medium tracking-tight mb-7">
              From
            </span>
            {[1, 2, 3, 4, 5, 6].map((item) => {
              if ((item === 1 && isWon) || (item === 1 && closedAuction)) {
                return (
                  <p
                    className={`md:text-xl ${
                      isWon || closedAuction ? "font-bold" : "font-semibold"
                    } tracking-tight text-green-500 w-[100px] truncate leading-6`}
                    title="@Usertal1354645"
                  >
                    @Usertal1354645
                  </p>
                );
              }
              if (item === 1) {
                return (
                  <p
                    className="md:text-xl font-semibold h-[3.75rem] tracking-tight text-black w-[100px] truncate leading-6"
                    title="@Usertal1354645"
                  >
                    @Usertal1354645
                  </p>
                );
              }
              return (
                <p
                  className="md:text-xl font-semibold h-[3.75rem] tracking-tight text-black w-[100px] truncate leading-6"
                  title="@Usertal1354645"
                >
                  @Usertal1354645
                </p>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="flex gap-1 items-center w-[95%] mx-auto mt-[1.1rem] px-4 md:ml-6 md:px-2 xl:px-0 xl:mx-[-5px] mb-[.4rem]">
        <ChevronLeftIcon className="w-[15px] h-5" />
        <a href="/" className="text-black font-semibold text-sm tracking-tight">
          Back to all acutions
        </a>
      </div>
      <section className="flex flex-col mt-10 items-center m-auto w-[95%] md:grid grid-rows-3 grid-flow-col md:gap-4 xl:gap-20 md:items-start mx-auto md:mt-6 xl:w-full">
        <div className="row-span-3 flex flex-col w-full items-center md:items-start md:max-w-[419px] xl:w-[410px]">
          <div className="w-[95%] max-w-[419px] md:w-full relative">
            <img
              src="https://gamefiinfo.com/uploads/202111/12/ece6842cd730141699e4c0bf7f2d57e9-413x413.png"
              alt=""
              className="w-full rounded-sm"
            />
            <div className="absolute bottom-3 w-[95%] mx-[.6rem] bg-white/70 rounded-lg p-4 md:hidden">
              <span className="flex gap-4 items-center text-md font-medium tracking-tight">
                Doodles <CheckCircleIcon className="w-4 text-success" />
              </span>
              <h3 className="font-bold text-xl tracking-tight">
                Doodles #3366
              </h3>
              <span className="text-md font-medium text-black tracking-tight">
                By <strong>@johnsnow</strong>
              </span>
            </div>
          </div>
          <div className="w-[95%] mt-5 max-w-[413px]">
            <h3 className="text-black text-xl font-semibold tracking-tight">
              Description
            </h3>
            <p className="w-full text-paragraph font-medium leading-4 mt-3">
              Once upon a time, there was a young girl. She was 9 years old and
              her name was Wende. Wende was incredibly intelligent, yet she had
              a hard time learning things by heart. No matter how hard she
              tried, she just could not memorize the planets of the solar
              system.
            </p>
          </div>
          <div className="hidden md:block mt-[4.3rem] w-full max-w-[421px] border-solid border-[1px] rounded-lg border-outline bg-white pb-14">
            <div className="flex items-center h-[52px] border-b-[1px]">
              <h3 className="px-7 text-md font-semibold text-black tracking-tight">
                Details
              </h3>
            </div>
            <div className="flex justify-between px-6">
              <div className="flex justify-between w-full">
                <div className="flex flex-col w-full mt-6 gap-4">
                  {[
                    { label: "Medium", value: "GIF" },
                    { label: "Dimensions", value: "200 x 200" },
                    { label: "File size", value: "20 MB" },
                    { label: "Contract address", value: "123kj78945454545" },
                    { label: "Token standard", value: "ERC - 741" },
                    { label: "Chain", value: "Ethereum" },
                  ].map(({ label, value }) => (
                    <div className="flex justify-between">
                      <p className="font-medium text-black text-md">{label}</p>
                      <p className="font-bold text-black text-end text-md max-w-[10ch] truncate">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 w-full md:max-w-[761px] xl:pl-0">
          <div className="hidden md:flex flex-col mb-10 mt-[-8px] ml-7 w-full">
            <div className="flex justify-between mt-[3px]">
              <span className="flex gap-[.6rem] items-center text-xl font-medium tracking-normal pl-1">
                Doodles <CheckCircleIcon className="w-5 text-success" />
              </span>
              <span
                className={`hidden md:flex ${
                  closedAuction || isWon ? "" : "w-[208px]"
                } px-5 items-center text-center rounded-[50px] text-white font-medium text-sm bg-paragraph tracking-tight h-[1.88rem] mr-1 mt-1`}
              >
                {closedAuction || isWon
                  ? "Auction closed"
                  : "Auction ends in: 2h 10m 15s"}
              </span>
            </div>
            <h3 className="font-bold text-[28px] tracking-normal pl-1 mt-1">
              Doodles #3366
            </h3>
            <span className="text-md font-medium text-black tracking-tight mt-1">
              By <strong>@johnsnow</strong>
            </span>
          </div>
          <div className="flex flex-col mt-9 gap-3 mx-2 max-w-[413px] md:max-w-[761px] md:mx-0 xl:ml-8 xl:mt-[-5px]">
            {isWon ? (
              <>
                <span className="mt-6 max-w-[419px] text-success flex gap-3 py-1 text-xl font-semibold items-center">
                  {" "}
                  <CrownIcon /> You won!
                </span>
                <button className="w-full h-10 bg-space mt-4 text-white text-md font-semibold tracking-tight rounded max-w-[440px] xl:max-w-[340px]">
                  Claim rewards
                </button>
              </>
            ) : (
              <>
                <p className="w-[173px] p-[.4rem] text-center rounded-[50px] text-white font-medium text-sm bg-paragraph tracking-normal xl:mt-8 xl:h-8">
                  Minimum bid: 0,3 ETH
                </p>
                <input
                  type="text"
                  placeholder="Type your bid"
                  className={`w-full h-10 text-sm bg-bid rounded placeholder-paragraph px-4 outline-none max-w-[440px] xl:mb-1 xl:max-w-[340px] ${
                    closedAuction && "cursor-not-allowed"
                  }`}
                  disabled={closedAuction}
                />
                <button
                  className={`w-full h-10 ${
                    closedAuction
                      ? "bg-paragraph cursor-not-allowed"
                      : "bg-space"
                  } text-white text-md font-semibold tracking-tight rounded max-w-[440px] xl:max-w-[340px]`}
                  disabled={closedAuction}
                >
                  {closedAuction ? "Auction closed" : "Make offer"}
                </button>
                <strong className="font-semibold text-sm tracking-tight text-black/70">
                  Your balance: 10 ETH
                </strong>
                <span className="w-[228px] p-[.4rem] px-4 text-center rounded-[50px] text-white font-medium text-sm bg-paragraph md:hidden">
                  Auction ends in: 2h 10m 15s
                </span>
              </>
            )}
          </div>
        </div>
        <div className="row-span-2 col-span-2 w-[95%] mx-auto xl:w-[761px] mt-6 xl:mt-9 xl:ml-7">
          <div className="mt-2 w-full max-w-[413px] border-solid border-[1px] rounded-lg border-outline bg-white mx-auto xl:h-[202px] md:max-w-[761px]">
            <div className="flex items-center h-[52px] border-b-[1px] xl:h-[55px]">
              <h3 className="px-8 flex items-center gap-2 font-semibold text-black tracking-tight text-md xl:px-6">
                <ListBulletIcon className="w-6" /> Your offers
              </h3>
            </div>
            <div className="">
              {offered || isWon ? (
                <div className="p-8 flex justify-between xl:p-5 ml-3">
                  <div className="flex flex-col gap-5">
                    <span className="text-md font-medium tracking-tight text-black">
                      Price
                    </span>
                    <div className="flex gap-6">
                      <span className="md:text-xl font-semibold tracking-tight text-black">
                        0,32 ETH
                      </span>
                      <span className="text-white tracking-tight text-md flex items-center justify-center font-medium bg-green-500 rounded-[30px] w-[114px] xl:h-8">
                        Highest bid
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-stfirstPlaceart justify-between xl:mr-6">
                    <span className="text-md text-black font-medium tracking-tight">
                      Date
                    </span>
                    <span className="font-semibold tracking-tight text-black xl:text-xl">
                      06/12/2022
                    </span>
                  </div>
                </div>
              ) : (
                <h3 className="p-[3.4rem] text-center text-paragraph text-xl font-medium tracking-normal xl:mr-3">
                  You don't have offers yet
                </h3>
              )}
            </div>
          </div>
          {firstPlace
            ? renderFirstPlaceOfferState()
            : isWon || closedAuction
            ? renderOffersWinState()
            : renderDefautOfferState()}
          <div className="mt-8 w-full max-w-[413px] border-solid border-[1px] rounded-lg border-outline m-auto bg-white md:hidden">
            <div className="flex items-center h-[52px] border-b-[1px]">
              <h3 className="px-8 text-md font-semibold text-black tracking-tight">
                Details
              </h3>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col w-full px-8 h-[305px] mt-7 gap-4">
                {[
                  { label: "Medium", value: "GIF" },
                  { label: "Dimensions", value: "200 x 200" },
                  { label: "File size", value: "20 MB" },
                  { label: "Contract address", value: "123kj78945454545" },
                  { label: "Token standard", value: "ERC - 741" },
                  { label: "Chain", value: "Ethereum" },
                ].map(({ label, value }) => (
                  <div className="flex justify-between">
                    <p className="font-medium text-black text-md">{label}</p>
                    <p className="font-bold text-black text-end text-md max-w-[10ch] truncate">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}

export default Auction;
