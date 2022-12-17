import CrownIcon16 from "../../assets/svg/CrownIcon16";
import CardButton from "../CardButton";
import Countdown from 'react-countdown';

type CardComponentProps = {
  isClose: boolean,
  firstPlace: boolean,
  isWon: boolean,
  isOwner: boolean,
  offered: boolean,
  outbid: boolean,
  onButtonClick: () => void,
  isButtonEnabled: boolean,
  collection: string,
  name: string,
  image: string,
  closedAt: Date,
  closingIn: Date,
  owner: string,
  bid: string,
  hasBid: boolean,
  currency: string,
  createdAt: Date,
  created: boolean
};

function CardComponent(props: CardComponentProps) {
  const {
    isClose,
    firstPlace,
    isWon,
    isOwner,
    offered,
    outbid,
    onButtonClick,
    isButtonEnabled,
    collection,
    name,
    image,
    closedAt,
    closingIn,
    owner,
    bid,
    hasBid,
    currency,
    createdAt,
    created
  } = props;

  const tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);

  return (
    <li
      className={`rounded-[29px] h-auto shadow-sm shadow-tab/[.15] p-2 md:shadow-none list-none md:w-[302px] ${
        isOwner && created || offered ? "md:h-[537px]" : "md:h-[472px]"
      } md:p-4 bg-white border-solid border-outline border-[1px] rounded-large flex flex-col items-center relative`}
    >
      {isWon && (
        <div className="w-20 h-5 md:w-[105px] h-[34px] top-4 right-4 flex justify-center items-center absolute gap-2 bg-white border-solid border-[1px] border-purple-500 rounded-sm z-[1] md:top-[1.93rem] md:right-[1.79rem]">
          <CrownIcon16 />
          <span className="text-transparent bg-clip-text bg-space items-center justify-around font-semibold text-sm tracking-tight">
            Winner
          </span>
        </div>
      )}
      {firstPlace && offered && !outbid && (
        <div className="w-20 h-[19px] top-4 right-[.9rem] md:w-[103px] md:h-[30px] flex justify-center items-center absolute gap-2 bg-space rounded-[30px] z-[1] md:top-[1.93rem] right-[1.9rem]">
          <span className="text-white justify-around font-medium text-3.5 md:text-sm pr-1 tracking-tight">
            Highest bid
          </span>
        </div>
      )}
      {outbid && offered && (
        <div className="w-20 h-[19px] md:w-[76px] md:h-[30px] flex justify-center items-center absolute gap-2 bg-error rounded-[30px] z-[1] top-[1.3rem] right-4 md:top-[1.93rem] md:right-7">
          <span className="text-white justify-around font-semibold text-sm pr-1 tracking-tight">
            Outbid
          </span>
        </div>
      )}
      <img
        src={image}
        alt={`${collection} - ${name}`}
        className="w-full h-auto rounded-lg md:w-[280px] md:h-[270px] md:max-w-full object-cover md:rounded-md"
      />
      <div className="flex flex-col w-full ml-3 md:gap-[.8rem] md:ml-0">
        <div className="mt-[4px] ml-[1px] md:flex flex-col md:mt-[.7rem]">
          <h3
            className="text-sm break-keep text-paragraph font-medium md:text-base tracking-tight"
            title={ collection }
          >
            { collection }
          </h3>
          <p className="text-sm md:text-black font-extrabold md:text-base h-[15px] mt-[-4px] tracking-tight xl:mt-[-8px]">
            { name }
          </p>
        </div>
        {isWon ? (
          <h3 className="text-success mt-5 text-center mb-2 font-bold text-md tracking-tight pr-4 md:pr-0 md:mb-0">
            You won!
          </h3>
        ) : (
          <div className="flex justify-between mt-2 mb-[-4px] md:mt-1">
            <div className="mt-[.2rem] pb-3 md:pb-0">
              <h3 className="text-sm font-semibold text-paragraph md:text-4 tracking-tight">
                {isOwner && isClose
                  ? "Auction ends in:"
                  : isOwner
                    ? "Auction end date:"
                    : "Auction ends in:"}
              </h3>
              <span
                className={`${
                  isClose ? "text-error" : "text-black tracking"
                } text-sm font-extrabold md:text-base tracking`}
              >
                {isClose && isOwner
                  ? "Closed auction"
                  : isOwner
                    ? `${closedAt.getFullYear()}/${closedAt.getMonth()}/${closedAt.getDay()} ${closedAt.getHours()}:${closedAt.getMinutes()}`
                    : isClose
                      ? "Closed auction"
                      : closingIn < tomorrow
                        ? <Countdown date={closingIn}/>
                        : `${closingIn.getFullYear()}/${closingIn.getMonth()}/${closingIn.getDay()} ${closingIn.getHours()}:${closingIn.getMinutes()}`
                }
              </span>
            </div>
            <div className="hidden md:block">
              <h3 className="text-paragraph font-semibold text-md text-end tracking-tight">
                {isOwner && isClose
                  ? "Winner:"
                  : isClose
                    ? "Winner:"
                    : isOwner
                      ? "Minimum hid:"
                      : "Highest bid:"}
              </h3>
              <span
                className={`${
                  isClose ? "text-button" : "text-black"
                } font-extrabold text-md block text-end truncate w-28 tracking-tight`}
              >
                {isOwner && isClose
                  ? owner
                  : isClose
                    ? owner
                    : `${bid} ${currency}`}
              </span>
            </div>
          </div>
        )}
        {isOwner && created && (
          <div className="mb-5 mt-[-2px]">
            <h3 className="text-paragraph font-semibold text-md tracking-tight">
              Created:
            </h3>
            <span className="text-black font-extrabold text-sm tracking-tight md:text-4">
              { `${createdAt.getFullYear()}/${createdAt.getMonth()}/${createdAt.getDay()} ${createdAt.getHours()}:${createdAt.getMinutes()}` }
            </span>
          </div>
        )}
        {offered && (
          <div className="my-2 mt-3">
            <h3 className="text-sm text-paragraph font-semibold md:text-4 tracking-tight">
              Your offer:
            </h3>
            <span
              className={`${
                outbid ? "text-error" : "text-success"
              } text-sm font-extrabold md:text-4 tracking-tight`}
            >
              `${bid} ${currency}`
            </span>
          </div>
        )}
        <CardButton
          created={created}
          firstPlace={firstPlace}
          isClose={isClose}
          isOwner={isOwner}
          isWon={isWon}
          offered={offered}
          outbid={outbid}
          hasBid={hasBid}
          onClick={onButtonClick}
          disabled={!isButtonEnabled}
        />
      </div>
    </li>
  );
}

export default CardComponent;
