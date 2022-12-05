import { PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren & {
  isWon: boolean;
};

function Button({ children, isWon }: ButtonProps) {
  return (
    <button
      className={`w-[270px] h-10 rounded-[15px] font-semibold text-sm leading-[14px] tracking-[-4%] text-white ${
        isWon ? "bg-gradient" : "bg-[#474EFF]"
      }`}
    >
      {children}
    </button>
  );
}

export default Button;
