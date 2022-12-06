import CrownIcon from "../../assets/svg/CrownIcon";
import Button from "../Button";
import Image from "../Image";

function Card() {
  const isClose = false;
  const isWon = true;
  const isOwner = false;

  return (
    <li className="list-none w-[302px] p-4 bg-white border-solid border-[#DEDEDE] border-[1px] rounded-[30px] flex flex-col justify-around relative">
      {isWon && (
        <div className="w-[107px] h-[38px] flex justify-center items-center absolute gap-2 bg-white border-solid border-[1px] border-purple-500 rounded-[15px] z-[1] top-7 right-7">
          <CrownIcon />
          <span className="text-transparent bg-clip-text bg-gradient items-center justify-around font-semibold text-sm">
            Winner
          </span>
        </div>
      )}
      <Image src="https://s2.glbimg.com/EPCclUpcD8MwJ3gqsD5Nw1FsOgw=/0x0:595x599/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_63b422c2caee4269b8b34177e8876b93/internal_photos/bs/2021/c/8/vwEnBlQTOR5JMPV1qigw/captura-de-tela-2021-12-14-114837.jpg" />
      <div className="flex flex-col w-full gap-[0.8rem] mt-3">
        <div className="flex flex-col">
          <h3 className="text-black font-semibold text-lg">Cyber cube</h3>
          <span className="text-black font-bold text-lg">#3333</span>
        </div>
        {isWon ? (
          <h3 className="text-[#24B817] text-center font-bold text-xl p-[0.875rem]">
            You Won!
          </h3>
        ) : (
          <div className="flex justify-between">
            <div>
              <h3 className="text-black font-semibold text-[15px]">
                {isOwner ? "Auction end date:" : " Auction ends in:"}
              </h3>
              <span
                className={`${
                  isClose ? "text-red-600" : "text-black"
                } font-bold text-lg`}
              >
                {isOwner
                  ? "30/12/2022"
                  : isClose
                  ? "Close auction"
                  : "2d 3h 10m 03s"}
              </span>
            </div>
            <div>
              <h3 className="text-black font-semibold text-[15px] text-end">
                {isOwner
                  ? "Minimum hid:"
                  : isClose
                  ? "Winner:"
                  : "Highest bid:"}
              </h3>
              <span
                className={`${
                  isClose ? "text-[#474EFF]" : "text-black"
                } font-bold text-lg block text-end mr-1 truncate w-28`}
              >
                {isOwner ? "0.6 BTH" : isClose ? "wallet123g454545" : "0.6 BTH"}
              </span>
            </div>
          </div>
        )}
        {isOwner && (
          <div>
            <h3 className="text-black font-semibold text-[15px]">Created:</h3>
            <span className="text-black font-bold text-lg">01/12/2022</span>
          </div>
        )}
        <Button isWon={isWon}>
          {isWon
            ? "Claim rewards"
            : isOwner
            ? "See offers"
            : isClose
            ? "View details"
            : "Make offers"}
        </Button>
      </div>
    </li>
  );
}

export default Card;
