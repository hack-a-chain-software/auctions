import {
  ChevronLeftIcon,
  ListBulletIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { Buffer } from "buffer";
import { Auction, Bid } from "contract_aptos";
import { useNftDetails } from "../../hooks/useNtfDetails";
import { useTimer } from "../../hooks/useTimer";
import { useCoinBalance } from "../../hooks/useCoinBalance";
import { useNftProperties } from "../../hooks/useNftProperties";
import { useClaimPrize } from "../../hooks/useClaimPrize";
import { useState } from "react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { formatDecimals } from "../../utils/formatDecimals";
import { formatInteger } from "../../utils/formatInteger";
import { AuctionClient } from "../../config/aptosClient";
import CrownIcon16 from "../../assets/svg/CrownIcon16";
import CrownIcon20 from "../../assets/svg/CrownIcon20";
import CrownIcon24 from "../../assets/svg/CrownIcon24";
import PageContainer from "../../components/PageContainer";
import Countdown, { zeroPad } from "react-countdown";
import Big from "big.js";
import "./Auction.styles.less";

window.Buffer = window.Buffer || Buffer;

type AuctionProps = {
  auction: Auction;
  allBids: Bid[];
};

type CountDownProps = {
  hours: number;
  minutes: number;
  seconds: number;
  days: number;
};

function AuctionComponent(props: AuctionProps) {
  const { endDate } = useTimer(Number(props.auction.endTime));
  const { account, signAndSubmitTransaction } = useWallet();
  const [closedAuction, setClosedAuction] = useState<boolean>(false);
  const [bidInput, setBidInput] = useState<string>("0");
  const allbids = props.allBids.slice(0).reverse();
  const [bidError, setBidError] = useState<string>("");

  const yourBids = allbids
    .filter(
      (bids) => bids.account.slice(-10) === String(account?.address).slice(-10)
    )
    .sort((a, b) => {
      if (a.bid < b.bid) return 1;
      if (a.bid > b.bid) return -1;
      return 0;
    });

  const minimumBid =
    Number(props.auction.currentBid) > 0
      ? Number(props.auction.currentBid) + Number(props.auction.minIncrement)
      : props.auction.minSellingPrice;

  const isWon =
    closedAuction &&
    props.auction.currentBidder.slice(-10) ===
      String(account?.address).slice(-10) &&
    Number(props.auction.currentBid) > 0
      ? true
      : false;

  const { tokenData } = useNftDetails(
    props.auction.lockedTokenId.token_data_id.creator,
    props.auction.lockedTokenId.token_data_id.collection,
    props.auction.lockedTokenId.token_data_id.name
  );

  const { balance, coinInfo } = useCoinBalance(
    String(account?.address),
    props.auction.auctionCoin
  );

  const { nftProperties } = useNftProperties(
    tokenData?.default_properties.data
  );

  const makeOffer = async (id: string, bid: string, coinType: string) => {
    if (bid < minimumBid) {
      setBidError("This offer is less than the minimum offer");
    } else if (!balance || Big(bid) > balance) {
      setBidError("You don't have enough balance");
    } else {
      await AuctionClient.bid(
        (payload) => signAndSubmitTransaction(payload),
        id,
        bid,
        coinType
      ).then((res) => (res ? window.location.reload() : false));
    }
  };

  const { claimRewards } = useClaimPrize(props.auction.id);

  const rendererDesk = ({ hours, minutes, seconds, days }: CountDownProps) => {
    if (closedAuction) {
      return (
        <span
          className={`hidden md:flex px-5 items-center text-center rounded-[50px] text-white font-medium text-sm bg-paragraph tracking-tight h-[1.88rem] mr-1 mt-1`}
        >
          Auction closed
        </span>
      );
    } else {
      return (
        <span className="hidden md:flex  px-5 items-center text-center rounded-[50px] text-white font-medium text-sm bg-paragraph tracking-tight h-[1.88rem] mr-1 mt-1">
          Auction ends in: {days > 0 ? `${zeroPad(days)}d` : ""}{" "}
          {hours > 0 ? `${zeroPad(hours)}h` : ""}{" "}
          {minutes > 0 ? `${zeroPad(minutes)}m` : ""} {zeroPad(seconds)}s
        </span>
      );
    }
  };

  const rendererMobile = ({
    hours,
    minutes,
    seconds,
    days,
  }: CountDownProps) => {
    if (closedAuction) {
      return (
        <span className="p-[.4rem] px-4 text-center rounded-[50px] text-white font-medium text-sm bg-paragraph md:hidden">
          Auction closed
        </span>
      );
    } else {
      return (
        <span className="p-[.4rem] px-4 text-center rounded-[50px] text-white font-medium text-sm bg-paragraph md:hidden">
          Auction ends in: {days > 0 ? `${zeroPad(days)}d` : ""}{" "}
          {hours > 0 ? `${zeroPad(hours)}h` : ""}{" "}
          {minutes > 0 ? `${zeroPad(minutes)}m` : ""} {zeroPad(seconds)}s
        </span>
      );
    }
  };

  function renderDefautOfferState() {
    return (
      <div
        className={`mt-8 max-w-[413px] border-solid border-[1px] rounded-lg border-outline bg-white mx-auto md:max-w-[761px]`}
      >
        <div className="flex items-center h-[52px] border-b-[1px] xl:h-[55px]">
          <h3 className="px-4 flex items-center gap-2 font-semibold text-black tracking-tight text-md xl:px-6">
            <ListBulletIcon className="w-6" /> Offers
          </h3>
        </div>
        {allbids.length > 0 ? (
          <div className="p-6 flex flex-col justify-between xl:w-[575px] xl:pr-0">
            <div className="flex justify-between w-full mb-1">
              <p className="text-md font-medium tracking-tight mb-7">Price</p>
              <p className="text-md font-medium tracking-tight mb-7 w-[140px]">
                From
              </p>
            </div>
            {allbids.map(({ bid, account }, i) => (
              <div className="flex justify-between  w-full" key={i}>
                <p className="md:text-xl font-semibold tracking-tight text-black h-[3.75rem]">
                  {formatDecimals(bid, coinInfo?.decimals || 0).toFixed(2)}
                </p>
                <p
                  className="md:text-xl font-semibold h-[3.75rem] tracking-tight text-black w-[140px] truncate leading-6"
                  title={account}
                >
                  {account}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <h3 className="p-[3.4rem] text-center text-paragraph text-xl font-medium tracking-normal xl:mr-3">
            This auction don't have offer yet
          </h3>
        )}
      </div>
    );
  }

  function renderFirstPlaceOfferState() {
    return (
      <div
        className={`mt-8 max-w-[413px] border-solid border-[1px] rounded-lg border-outline bg-white mx-auto md:max-w-[761px]`}
      >
        <div className="flex items-center h-[52px] border-b-[1px] xl:h-[55px]">
          <h3 className="px-4 flex items-center gap-2 font-semibold text-black tracking-tight text-md xl:px-6">
            <ListBulletIcon className="w-7" /> Offers
          </h3>
        </div>
        {allbids.length > 0 ? (
          <div className="p-6 flex flex-col justify-between xl:w-[575px] xl:pr-0">
            <div className="flex justify-between w-full mb-1">
              <p className="text-md font-medium tracking-tight mb-7">Price</p>
              <p className="text-md font-medium tracking-tight mb-7 w-[140px]">
                From
              </p>
            </div>
            {allbids.map(({ bid, account }, i) => (
              <div className="flex justify-between w-full" key={i}>
                {i === 0 ? (
                  <p className="md:text-xl font-semibold tracking-tight text-black h-[3.75rem] flex gap-5">
                    {formatDecimals(bid, coinInfo?.decimals || 0).toFixed(2)}
                    <CrownIcon24 />
                  </p>
                ) : (
                  <p className="md:text-xl font-semibold tracking-tight text-black h-[3.75rem]">
                    {formatDecimals(bid, coinInfo?.decimals || 0).toFixed(2)}
                  </p>
                )}
                <p
                  className="md:text-xl font-semibold h-[3.75rem] tracking-tight text-black w-[140px] truncate leading-6"
                  title={account}
                >
                  {account}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <h3 className="p-[3.4rem] text-center text-paragraph text-xl font-medium tracking-normal xl:mr-3">
            This auction don't have offer yet
          </h3>
        )}
      </div>
    );
  }

  function renderOffersWinState() {
    return (
      <div
        className={`mt-8 max-w-[413px] border-solid border-[1px] rounded-lg border-outline bg-white mx-auto md:max-w-[761px]`}
      >
        <div className="flex items-center h-[52px] border-b-[1px] xl:h-[55px]">
          <h3 className="px-4 flex items-center gap-2 font-semibold text-black tracking-tight text-md xl:px-6">
            <ListBulletIcon className="w-7" /> Offers
          </h3>
        </div>
        {allbids.length > 0 ? (
          <div className="p-6 flex flex-col justify-between xl:w-[575px] xl:pr-0">
            <div className="flex justify-between w-full mb-1">
              <p className="text-md font-medium tracking-tight mb-7">Price</p>
              <p className="text-md font-medium tracking-tight mb-7 w-[140px]">
                From
              </p>
            </div>
            {allbids.map(({ bid, account }, i) => (
              <div className="flex justify-between w-full" key={i}>
                {i === 0 ? (
                  <>
                    <div className="relative mt-1">
                      <p className="absolute bottom-16 text-transparent bg-clip-text bg-space max-w-[419px] flex gap-2 text-sm font-semibold items-center">
                        <CrownIcon16 /> Winner
                      </p>
                      <p
                        className={`md:text-xl ${
                          isWon || closedAuction ? "font-bold" : "font-semibold"
                        } tracking-tight text-success h-[3.75rem]`}
                      >
                        {formatDecimals(bid, coinInfo?.decimals || 0).toFixed(
                          2
                        )}
                      </p>
                    </div>
                    <p
                      className="md:text-xl font-semibold h-[3.75rem] tracking-tight text-success w-[140px] truncate leading-6"
                      title={account}
                    >
                      {account}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="md:text-xl font-semibold tracking-tight text-black h-[3.75rem]">
                      {formatDecimals(bid, coinInfo?.decimals || 0).toFixed(2)}
                    </p>
                    <p
                      className="md:text-xl font-semibold h-[3.75rem] tracking-tight text-black w-[140px] truncate leading-6"
                      title={account}
                    >
                      {account}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <h3 className="p-[3.4rem] text-center text-paragraph text-xl font-medium tracking-normal xl:mr-3">
            This auction don't have offer yet
          </h3>
        )}
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="flex gap-1 items-center w-[95%] max-w-[413px] mx-auto mt-[1.1rem] md:ml-6 md:px-2 xl:px-0 xl:mx-[-5px] mb-[.4rem]">
        <ChevronLeftIcon className="w-[15px] h-5" />
        <a href="/" className="text-black font-semibold text-sm tracking-tight">
          Back to all acutions
        </a>
      </div>
      <section className="Auction flex flex-col mt-10 items-center m-auto w-[95%] md:grid grid-rows-3 grid-flow-col md:gap-4 xl:gap-20 md:items-start mx-auto md:mt-6 xl:w-full">
        <div className="row-span-3 flex flex-col w-full items-center md:items-start md:max-w-[419px] xl:w-[410px]">
          <div className="w-[95%] max-w-[419px] md:w-full relative">
            <img src={tokenData?.uri} alt="" className="w-full rounded-sm" />
            <div className="absolute bottom-3 w-[95%] mx-[.6rem] bg-white/70 rounded-lg p-4 md:hidden">
              <span className="flex gap-4 items-center text-md font-medium tracking-tight">
                {props.auction?.lockedTokenId.token_data_id.collection}{" "}
                <CheckCircleIcon className="w-4 text-success" />
              </span>
              <h3 className="font-bold text-xl tracking-tight">
                {props.auction?.lockedTokenId.token_data_id.name}
              </h3>
              <p
                className="text-md font-medium text-black tracking-tight w-full truncate"
                title={props.auction?.lockedTokenId.token_data_id.creator}
              >
                By{" "}
                <strong>
                  {" "}
                  {props.auction?.lockedTokenId.token_data_id.creator}
                </strong>
              </p>
            </div>
          </div>
          <div className="w-[95%] mt-5 max-w-[413px]">
            <h3 className="text-black text-xl font-semibold tracking-tight">
              Description
            </h3>
            <p className="w-full text-paragraph font-medium leading-4 mt-3">
              {tokenData?.description}
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
                  {nftProperties.map(({ label, value }) => (
                    <div className="flex justify-between" key={value}>
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
        <div className="col-span-2 w-[95%] flex justify-center md:block xl:pl-0 xl:w-[761px]">
          <div className="hidden md:flex flex-col w-[95%] mb-10 mt-[-8px] md:ml-3 xl:ml-7">
            <div className="flex justify-between mt-[3px]">
              <span className="flex gap-[.6rem] items-center text-xl font-medium tracking-normal pl-1">
                {props.auction?.lockedTokenId.token_data_id.collection}{" "}
                <CheckCircleIcon className="w-5 text-success" />
              </span>
              {isWon ? (
                <span
                  className={`hidden md:flex px-5 items-center text-center rounded-[50px] text-white font-medium text-sm bg-paragraph tracking-tight h-[1.88rem] mr-1 mt-1`}
                >
                  Auction closed
                </span>
              ) : (
                <Countdown
                  date={endDate}
                  renderer={rendererDesk}
                  onComplete={(completedOnStart) =>
                    setClosedAuction(completedOnStart.completed)
                  }
                />
              )}
            </div>
            <h3 className="font-bold text-[28px] tracking-normal pl-1 mt-1">
              {props.auction?.lockedTokenId.token_data_id.name}
            </h3>
            <p className="text-md font-medium text-black tracking-tight mt-1 ml-1 truncate w-[40ch] lg:w-[70ch]">
              By{" "}
              <strong>
                {props.auction?.lockedTokenId.token_data_id.creator}
              </strong>
            </p>
          </div>
          <div className="flex flex-col mt-9 gap-3 mx-2 w-[95%] max-w-[413px] md:max-w-[761px] md:mx-0 md:ml-3 xl:ml-8 xl:mt-[-5px]">
            {isWon ? (
              <>
                <span className="mt-14 max-w-[419px] text-success flex justify-center gap-3 py-1 text-xl font-semibold items-center md:justify-start xl:pl-5">
                  <CrownIcon20 /> You won!
                </span>
                <button
                  onClick={claimRewards}
                  disabled={props.auction.tokenClaimed}
                  className="w-full h-10 bg-space mt-4 text-white text-md font-semibold tracking-tight rounded max-w-[440px] xl:max-w-[340px] xl:ml-5"
                >
                  {props.auction.tokenClaimed
                    ? "You already claimed the prize"
                    : "Claim rewards"}
                </button>
              </>
            ) : (
              <>
                <p className="w-[173px] p-[.4rem] text-center rounded-[50px] text-white font-medium text-sm bg-paragraph tracking-normal xl:mt-8 xl:h-8">
                  Minimum bid:{" "}
                  {formatDecimals(minimumBid, coinInfo?.decimals || 0).toFixed(
                    2
                  )}{" "}
                  {coinInfo?.symbol}
                </p>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="Type your bid"
                  className={`Price w-full h-10 text-sm bg-bid rounded placeholder-paragraph px-4 outline-none max-w-[440px] xl:mb-1 xl:max-w-[340px] ${
                    closedAuction && "cursor-not-allowed"
                  }`}
                  disabled={closedAuction}
                  onChange={({ target }) => setBidInput(target.value)}
                />
                <button
                  type="button"
                  className={`w-full h-10 ${
                    closedAuction
                      ? "bg-paragraph cursor-not-allowed"
                      : "bg-space"
                  } text-white text-md font-semibold tracking-tight rounded max-w-[440px] xl:max-w-[340px] xl:mt-1`}
                  disabled={closedAuction}
                  onClick={async () =>
                    await makeOffer(
                      String(props.auction.id),
                      formatInteger(bidInput, coinInfo?.decimals || 0).toFixed(
                        0
                      ),
                      props.auction.auctionCoin
                    )
                  }
                >
                  {closedAuction ? "Auction closed" : "Make offer"}
                </button>
                {bidError && <strong className="text-error">{bidError}</strong>}
                <strong className="font-semibold text-sm tracking-tight text-black/70">
                  Your balance:{" "}
                  {formatDecimals(
                    Number(balance) || 0,
                    coinInfo?.decimals || 0
                  ).toFixed(2)}{" "}
                  {coinInfo?.symbol}
                </strong>
                <Countdown
                  date={endDate}
                  renderer={rendererMobile}
                  onComplete={(completedOnStart) =>
                    setClosedAuction(completedOnStart.completed)
                  }
                />
              </>
            )}
          </div>
        </div>
        <div
          className={`row-span-2 col-span-2 mx-auto w-[95%] md:max-w-[416px] lg:max-w-[761px] xl:max-w-[761px] mt-6 xl:mt-${
            isWon ? "2rem" : "9"
          } xl:ml-7`}
        >
          <div className="mt-2 w-full max-w-[413px] border-solid border-[1px] rounded-lg border-outline bg-white mx-auto md:max-w-[761px] xl:mt-[-5px]">
            <div className="flex items-center h-[52px] border-b-[1px] xl:h-[55px]">
              <h3 className="px-8 flex items-center gap-2 font-semibold text-black tracking-tight text-md xl:px-6">
                <ListBulletIcon className="w-6" /> Your offers
              </h3>
            </div>
            <div>
              {yourBids.length > 0 || isWon ? (
                <div className="p-8 flex flex-col justify-between gap-3 xl:p-5 ml-3">
                  <div className="flex justify-between w-full xl:w-[575px]">
                    <p>Price</p>
                    <p>Date</p>
                  </div>
                  {yourBids.map(({ bid, timestamp }, i) => (
                    <>
                      <div className="flex justify-between xl:w-[575px]">
                        <p className="flex gap-4 items-center">
                          <>
                            {formatDecimals(
                              bid,
                              coinInfo?.decimals || 0
                            ).toFixed(2)}
                            {i === 0 && (
                              <span className="text-white tracking-tight text-md flex items-center justify-center font-medium bg-green-500 rounded-[30px] w-[114px] xl:h-8">
                                Highest bid
                              </span>
                            )}
                          </>
                        </p>
                        <p>
                          {new Date(
                            Number(timestamp) / 1000
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  ))}
                </div>
              ) : (
                <h3 className="p-[3.4rem] text-center text-paragraph text-xl font-medium tracking-normal xl:mr-3">
                  You don't have offers yet
                </h3>
              )}
            </div>
          </div>
          {isWon || closedAuction
            ? renderOffersWinState()
            : allbids.length > 1
            ? renderFirstPlaceOfferState()
            : renderDefautOfferState()}
          <div className="mt-8 w-full max-w-[413px] border-solid border-[1px] rounded-lg border-outline m-auto bg-white md:hidden">
            <div className="flex items-center h-[52px] border-b-[1px]">
              <h3 className="px-8 text-md font-semibold text-black tracking-tight">
                Details
              </h3>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col w-full px-8 pb-8 mt-7 gap-4">
                {nftProperties.map(({ label, value }) => (
                  <div className="flex justify-between" key={value}>
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

export default AuctionComponent;
