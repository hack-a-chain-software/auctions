import { PropsWithChildren } from "react";

function PageContainerDoubleSideRight(props: PropsWithChildren) {
  return (
    <div className="flex w-full flex-col gap-y-6 relative">
      {props.children}
    </div>
  );
}

export default PageContainerDoubleSideRight;
