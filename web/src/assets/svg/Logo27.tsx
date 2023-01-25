
import { useEnv } from "../../hooks/useEnv";

function Logo27() {
  return (
    <img width={27} height={27}  src={useEnv("AUCTION_HEADER_LOGO")}></img>
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="27"
    //   height="27"
    //   fill="none"
    //   viewBox="0 0 27 27"
    // >
    //   <g clipPath="url(#clip0_848_53)">
    //     <rect
    //       width="27"
    //       height="27"
    //       fill="url(#paint0_linear_848_53)"
    //       rx="13.5"
    //     ></rect>
    //     <path
    //       fill="url(#paint1_linear_848_53)"
    //       d="M7.14 9.881C4.55 8.708.098 11.74.098 11.74c-.587 2.413-1.76 7.454-1.76 8.315 0 .86 4.826 6.88 7.239 9.783l13.5-.783 9.097-10.565s1.124-5.657-1.271-7.24c-3.248-2.144-2.993 7.767-6.848 7.24-2.174-.298-2.42-2.966-4.598-3.228-2.31-.28-3.217 2.9-5.478 2.347-3.123-.763.092-6.403-2.837-7.728z"
    //     ></path>
    //     <ellipse
    //       cx="19.289"
    //       cy="4.304"
    //       fill="#E1CAFF"
    //       rx="2.885"
    //       ry="1.875"
    //       transform="rotate(32.462 19.289 4.304)"
    //     ></ellipse>
    //     <circle cx="22.696" cy="8.217" r="1.37" fill="#E1CAFF"></circle>
    //     <path
    //       fill="#D9D9D9"
    //       d="M11.566 6.44c.026.007.024.058-.002.064-.22.048-.616.166-.823.433-.188.243-.298.71-.353 1.016-.005.028-.068.026-.07-.002-.037-.31-.117-.783-.29-1.037-.19-.279-.578-.422-.794-.483-.026-.007-.024-.06.002-.065.22-.047.616-.166.823-.432.188-.243.298-.71.353-1.017.005-.028.068-.026.071.003.036.31.116.782.29 1.036.189.279.577.422.793.483zM19.04 12.23c.027.008.025.06-.002.065-.22.047-.615.166-.822.433-.189.242-.299.71-.354 1.016-.005.028-.067.026-.07-.002-.036-.31-.117-.783-.29-1.037-.19-.278-.577-.422-.794-.483-.026-.007-.024-.06.002-.065.22-.047.616-.166.823-.432.189-.243.299-.71.354-1.017.005-.028.067-.026.07.003.036.31.116.782.29 1.036.19.279.577.422.794.483z"
    //     ></path>
    //   </g>
    //   <defs>
    //     <linearGradient
    //       id="paint0_linear_848_53"
    //       x1="13.5"
    //       x2="13.5"
    //       y1="0"
    //       y2="27"
    //       gradientUnits="userSpaceOnUse"
    //     >
    //       <stop stopColor="#9747FF"></stop>
    //       <stop offset="0.21" stopColor="#9747FF"></stop>
    //       <stop offset="1" stopColor="#474EFF" stopOpacity="0.74"></stop>
    //     </linearGradient>
    //     <linearGradient
    //       id="paint1_linear_848_53"
    //       x1="13.386"
    //       x2="13.386"
    //       y1="9.611"
    //       y2="29.838"
    //       gradientUnits="userSpaceOnUse"
    //     >
    //       <stop stopColor="#6D00C4"></stop>
    //       <stop offset="1" stopColor="#0037C4" stopOpacity="0"></stop>
    //     </linearGradient>
    //     <clipPath id="clip0_848_53">
    //       <rect width="27" height="27" fill="#fff" rx="13.5"></rect>
    //     </clipPath>
    //   </defs>
    // </svg>
  );
}

export default Logo27;
