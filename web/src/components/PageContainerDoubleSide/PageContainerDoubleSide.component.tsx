import { PropsWithChildren } from "react";
import PageContainerDoubleSideLeft from "./PageContainerDoubleSideLeft.component";
import PageContainerDoubleSideRight from "./PageContainerDoubleSideRight.component";

function PageContainerDoubleSide(props: PropsWithChildren<PropsWithChildren>) {
  return (
    <div className="flex pt-7.5 pb-10 flex-col lg:flex-row max-w-full mx-auto max-w-[1280px] gap-6">
      {props.children}
    </div>
  );
}

const Left = PageContainerDoubleSideLeft;
const Right = PageContainerDoubleSideRight;

PageContainerDoubleSide.Left = Left;
PageContainerDoubleSide.Right = Right;

export default PageContainerDoubleSide;
