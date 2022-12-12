import CrownIcon from "../../assets/svg/CrownIcon";
import Button from "../Button";
import Image from "../Image";

type CardProps = {
  card: string;
};

function Card({ card }: CardProps) {
  const isClose = false;
  const firstPlace = false;
  const isWon = false;
  const isOwner = false;
  const offered = true;
  const outbid = true;

  return (
    <li
      className={`rounded-[29px] h-auto drop-shadow-navbar p-2 md:drop-shadow-none list-none md:w-[302px] ${
        isOwner || offered ? "md:h-[537px]" : "md:h-[472px]"
      } md:p-4 bg-white border-solid border-outline border-[1px] rounded-large flex flex-col items-center relative`}
    >
      {isWon && (
        <div className="w-20 h-5 md:w-[105px] h-[34px] flex justify-center items-center absolute gap-2 bg-white border-solid border-[1px] border-purple-500 rounded-sm z-[1] top-6 right-4 top-[1.93rem] right-[1.79rem]">
          <CrownIcon />
          <span className="text-transparent bg-clip-text bg-space items-center justify-around font-semibold text-sm tracking-tight">
            Winner
          </span>
        </div>
      )}
      {firstPlace && offered && (
        <div className="w-20 h-[19px] md:w-[103px] md:h-[30px] flex justify-center items-center absolute gap-2 bg-space rounded-[30px] z-[1] top-6 right-[1.40rem] md:top-[1.93rem] right-[1.79rem]">
          <span className="text-white justify-around font-medium text-3.5 md:text-sm pr-1 tracking-tight">
            Highest bid
          </span>
        </div>
      )}
      {outbid && offered && (
        <div className="w-20 h-[19px] md:w-[76px] md:h-[30px] flex justify-center items-center absolute gap-2 bg-error rounded-[30px] z-[1] top-[1.3rem] right-[1.40rem] md:top-[1.93rem] md:right-[1.79rem]">
          <span className="text-white justify-around font-semibold text-sm pr-1 tracking-tight">
            Outbid
          </span>
        </div>
      )}
      <Image
        src="https://nextdrop.s3.amazonaws.com/8287doodles-nft.png"
        className="w-full h-auto rounded-lg md:w-[280px] md:h-[270px] md:max-w-full object-cover md:rounded-md"
      />
      <div className="flex flex-col w-full ml-3 md:gap-[.8rem] md:ml-0">
        <div className="mt-[2px] md:flex flex-col md:mt-[.7rem]">
          <h3
            className="text-sm break-keep text-paragraph font-semibold md:text-base tracking-tight"
            title="Bored Ape Yatch Club"
          >
            Bored Ape Yatch Club
          </h3>
          <p className="text-sm md:text-black font-extrabold md:text-base h-[15px] mt-[-4px] tracking-tight xl:mt-[-8px]">
            #3040
          </p>
        </div>
        {isWon ? (
          <h3 className="text-success text-center mt-5 font-bold text-md tracking-tight">
            You won!
          </h3>
        ) : (
          <div className="flex justify-between mt-1 mb-[-4px]">
            <div className="mt-[.2rem]">
              <h3 className="text-sm font-semibold text-paragraph md:text-4 tracking-tight">
                {isOwner && isClose
                  ? "Auction ends in:"
                  : isOwner
                  ? "Auction end date:"
                  : "Auction ends in:"}
              </h3>
              <span
                className={`${
                  isClose ? "text-error" : "text-black tracking-tight"
                } text-sm font-extrabold md:text-base tracking-tight`}
              >
                {isClose && isOwner
                  ? "Closed auction"
                  : isOwner
                  ? "30/12/2022"
                  : isClose
                  ? "Closed auction"
                  : "2d 3h 10m 03s"}
              </span>
            </div>
            <div className="hidden md:block mt-[.2rem]">
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
                  ? "wallet123g454545"
                  : isClose
                  ? "wallet123g454545"
                  : "0.6 BTH"}
              </span>
            </div>
          </div>
        )}
        {isOwner && (
          <div className="hidden md:block mb-5">
            <h3 className="text-black font-semibold text-md tracking-tight">
              Created:
            </h3>
            <span className="text-black font-extrabold text-md tracking-tight">
              01/12/2022
            </span>
          </div>
        )}
        {offered && (
          <div className="hidden md:block my-1.5">
            <h3 className="text-paragraph font-semibold text-md tracking-tight">
              Your offer:
            </h3>
            <span
              className={`${
                outbid ? "text-error" : "text-success"
              } font-extrabold text-md tracking-tight`}
            >
              0,54 BTH
            </span>
          </div>
        )}
        <Button
          firstPlace={firstPlace}
          isClose={isClose}
          isOwner={isOwner}
          isWon={isWon}
          offered={offered}
          outbid={outbid}
        />
      </div>
    </li>
  );
}

export default Card;
