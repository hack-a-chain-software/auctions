import { PropsWithChildren } from "react";

function PageContainerDoubleSideLeft(props: PropsWithChildren) {
  return (
    <div className="flex lg:max-w-[419px] flex-col w-full relative">
      {props.children}
    </div>
  );
}

export default PageContainerDoubleSideLeft;
