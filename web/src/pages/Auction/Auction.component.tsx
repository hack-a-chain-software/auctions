import { ChevronLeftIcon } from "@heroicons/react/24/solid";

function Auction() {
  return (
    <>
      <div className="flex gap-2 items-center">
        <ChevronLeftIcon className="w-[15px] h-[5]" />
        <span className="text-black font-semibold text-sm tracking-tight">
          Back to all acutions
        </span>
      </div>
      <section className="flex flex-col items-center w-[95%] m-auto">
        <div className="w-[95%] h-[300px] max-w-[413px]">
          <img
            src="https://www.bitmag.com.br/wp-content/uploads/2022/03/monkey-7009603_1920.jpg"
            alt=""
            className="w-full h-full rounded-sm object-cover"
          />
        </div>
        <div className="w-[95%]">
          <h3 className="text-black text-xl font-semibold tracking-tight">
            Description
          </h3>
          <p className="w-full max-w-[419px] text-paragraph font-medium leading-4">
            Once upon a time, there was a young girl. She was 9 years old and
            her name was Wende. Wende was incredibly intelligent, yet she had a
            hard time learning things by heart. No matter how hard she tried,
            she just could not memorize the planets of the solar system.
          </p>
        </div>
        <div className="w-[95%] max-w-[419px] border-solid border-[1px] rounded-lg border-outline">
          <div className="flex items-center h-[52px] border-b-[1px]">
            <h3 className="px-8 text-md font-medium text-black tracking-tight">Details</h3>
          </div>
          <div className="flex flex-col px-8 h-[305px] mt-7 gap-4">
            <span>Medium</span>
            <span>Dimensions</span>
            <span>File size</span>
            <span>Contract address</span>
            <span>Token standard</span>
            <span>Chain</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default Auction;
