import { PropsWithChildren } from "react";
import "react-loading-skeleton/dist/skeleton.css";

export const PageContainer = (props: PropsWithChildren<PropsWithChildren>) => {
  return (
    <div className="flex p-5 flex-col w-full overflow-y-hidden mx-auto max-w-[1512px]">
      {props.children}
    </div>
  );
};

export default PageContainer;
