import CrownIcon16 from "../../assets/svg/CrownIcon16";
import CardButton from "../CardButton";
import Countdown, { CountdownRenderProps } from 'react-countdown';

type CardComponentProps = {
  live: boolean,
  noBids: boolean,
  won: boolean,
  iBided: boolean,
  winning: boolean,
  created: boolean,
  explore: boolean,
  onButtonClick: () => void,
  isButtonEnabled: boolean,
  collection: string,
  name: string,
  image: string,
  closedAt: Date,
  bidder: string,
  bid: string,
  currency: string,
  createdAt: Date
};

function CardComponent(props: CardComponentProps) {
  const {
    live, // If auction is closed of live
    noBids, // If the auction has no bids
    won, // If the logged account won the auction
    iBided, // If the logged account made an offer/bid
    winning, // If the logged account has the highest offer/bid
    created, // If the card is on the created page
    explore, // If the card is on the explore page
    onButtonClick,
    isButtonEnabled,
    collection,
    name,
    image,
    bidder,
    bid,
    currency,
    createdAt,
    closedAt
  } = props;

  function renderCountdown(props: CountdownRenderProps) {
    const { days, hours, minutes, seconds } = props;
    const fDays = days > 0 ? `${days}d ` : '';
    const fHours = hours > 0 ? `${hours}h ` : '';
    const fMinutes = minutes > 0 ? `${minutes}m ` : '';
    const fSeconds = seconds > 0 ? `${seconds}s ` : '';

    return fDays+fHours+fMinutes+fSeconds;
  }

  function renderTags() {
    return <>
      { won && (
        <div className="w-20 h-5 md:w-[105px] h-[34px] top-4 right-4 flex justify-center items-center absolute gap-2 bg-white border-solid border-[1px] border-purple-500 rounded-sm z-[1] md:top-[1.93rem] md:right-[1.79rem]">
          <CrownIcon16 />
          <span className="text-transparent bg-clip-text bg-space items-center justify-around font-semibold text-sm tracking-tight">
              Winner
            </span>
        </div>
      )}
      { !explore && live && winning && (
        <div className="w-20 h-[19px] top-4 right-[.9rem] md:w-[103px] md:h-[30px] flex justify-center items-center absolute gap-2 bg-space rounded-[30px] z-[1] md:top-[1.93rem] right-[1.9rem]">
            <span className="text-white justify-around font-medium text-3.5 md:text-sm pr-1 tracking-tight">
              Highest bid
            </span>
        </div>
      )}
      { !explore && live && !winning && (
        <div className="w-20 h-[19px] md:w-[76px] md:h-[30px] flex justify-center items-center absolute gap-2 bg-error rounded-[30px] z-[1] top-[1.3rem] right-4 md:top-[1.93rem] md:right-7">
            <span className="text-white justify-around font-semibold text-sm pr-1 tracking-tight">
              Outbid
            </span>
        </div>
      )}
    </>;
  }

  function renderImage() {
    return <img
      src={image}
      alt={`${collection} - ${name}`}
      className="w-full h-auto rounded-lg md:w-[280px] md:h-[270px] md:max-w-full object-cover md:rounded-md"
    />;
  }

  function renderDetails() {
    return <>
      {/* NFT collection and name */}
      <div className="mt-[4px] ml-[1px] md:flex flex-col md:mt-[.7rem]">
        <h3 className="text-sm break-keep text-paragraph font-medium md:text-base tracking-tight">
          { collection }
        </h3>
        <p className="text-sm md:text-black font-extrabold md:text-base h-[15px] mt-[-4px] tracking-tight xl:mt-[-8px]">
          { name }
        </p>
      </div>

      {/* If you won the auction */}
      { won && (
        <h3 className="text-success mt-5 text-center mb-2 font-bold text-md tracking-tight pr-4 md:pr-0 md:mb-0">
          You won!
        </h3>
      )}

      {/* If you didn't win the auction */}
      { !won && (
        <div className="flex justify-between mt-2 mb-[-4px] md:mt-1">
          {/* Auction end detail */}
          <div className="mt-[.2rem] pb-3 md:pb-0">
            <h3 className="text-sm font-semibold text-paragraph md:text-4 tracking-tight">
              { created && live ? "Auction end date:" : "Auction ends in:" }
            </h3>
            <span className={`${ live ? "text-black tracking" : "text-error" } text-sm font-extrabold md:text-base tracking`}>
              { created && live && closedAt.toLocaleString().replace(',', '') }
              { !created && live && <Countdown date={closedAt} renderer={renderCountdown}/> }
              { !live && 'Closed auction' }
            </span>
          </div>

          {/* Bid or winner detail */}
          <div className="hidden md:block">
            <h3 className="text-paragraph font-semibold text-md text-end tracking-tight">
              { !live && 'Winner:' }
              { live && noBids && 'Minimum bid:' }
              { live && !noBids && 'Highest bid:' }
            </h3>
            <span className={`${ live ? "text-black" : "text-button" } font-extrabold text-md block text-end truncate w-28 tracking-tight`}>
              { !live && bidder }
              { live && `${bid} ${currency}` }
              </span>
          </div>
        </div>
      )}

      {/* Created date detail */}
      { created && (
        <div className="mb-5 mt-[-2px]">
          <h3 className="text-paragraph font-semibold text-md tracking-tight">
            Created:
          </h3>
          <span className="text-black font-extrabold text-sm tracking-tight md:text-4">
            { createdAt.toLocaleString().replace(',', '') }
          </span>
        </div>
      )}

      {/* When the logger account made an offer */}
      {iBided && (
        <div className="my-2 mt-3">
          <h3 className="text-sm text-paragraph font-semibold md:text-4 tracking-tight">
            Your offer:
          </h3>
          <span className={`${ winning ? (explore ? "text-button" : "text-success") : "text-error" } text-sm font-extrabold md:text-4 tracking-tight`}>
            {bid} {currency}
          </span>
        </div>
      )}
    </>;
  }

  function renderButton() {
    return <CardButton
      created={created}
      explore={explore}
      iBided={iBided}
      noBids={noBids}
      live={live}
      won={won}
      onClick={onButtonClick}
      disabled={!isButtonEnabled}
    />;
  }

  return (
    <li
      className={`rounded-[29px] h-auto shadow-sm shadow-tab/[.15] p-2 md:shadow-none list-none md:w-[302px] md:p-4 bg-white border-solid border-outline border-[1px] rounded-large flex flex-col items-center relative`}
    >
      { renderTags() }
      { renderImage() }
      <div className="flex flex-col w-full ml-3 md:gap-[.8rem] md:ml-0">
        { renderDetails() }
        { renderButton() }
      </div>
    </li>
  );
}

export default CardComponent;
