import { PropsWithChildren } from "react";

const CardsContainer = (props: PropsWithChildren) => {
  return (
    <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 smaller:grid-cols-2 sm:grid-cols-3 md:flex md:justify-center lg:justify-start flex-wrap gap-6">
      { props.children }
    </div>
  );
};

export default CardsContainer;
