import { PropsWithChildren } from "react";

function PageContainerDoubleSideRight(props: PropsWithChildren) {
  return (
    <div className="flex w-full flex-col relative">
      {props.children}
    </div>
  );
}

export default PageContainerDoubleSideRight;
