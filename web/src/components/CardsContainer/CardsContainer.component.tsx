import { PropsWithChildren } from "react";

const CardsContainer = (props: PropsWithChildren) => {
  return (
    <div className="w-full px-6 grid grid-cols-2 gap-6">
      { props.children }
    </div>
  );
};

export default CardsContainer;
