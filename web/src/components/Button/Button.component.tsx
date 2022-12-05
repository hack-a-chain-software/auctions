import { PropsWithChildren } from "react";

function Button({ children }: PropsWithChildren) {
  return (
    <button className="w-[270px] h-10 rounded-[15px] font-semibold text-sm leading-[14px] tracking-[-4%] text-white bg-[#474EFF]">
      {children}
    </button>
  );
}

export default Button;
