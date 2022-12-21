import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";

const PageContainer = (props: PropsWithChildren) => {
  return (
    <div className="flex pt-7.5 pb-10 box-content flex-col w-full overflow-y-hidden mx-auto max-w-[1280px]">
      <ToastContainer />
      {props.children}
    </div>
  );
};

export default PageContainer;
