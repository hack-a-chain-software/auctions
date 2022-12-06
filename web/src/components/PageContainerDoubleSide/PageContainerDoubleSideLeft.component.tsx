import { PropsWithChildren } from "react";

function PageContainerDoubleSideLeft(props: PropsWithChildren) {
  return (
    <div className="flex lg:max-w-[492px] flex-col w-full gap-y-6 relative">
      {props.children}
    </div>
  );
}

export default PageContainerDoubleSideLeft;
