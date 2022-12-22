import { ReactNode } from 'react';

type TabHeaderProps = {
  title: string,
  subtitle: string,
  children: ReactNode,
}

function ContentHeader(props: TabHeaderProps) {
  const { title, subtitle, children } = props;

  return <div className="md:mt-[112px] overflow-x-hidden">
    <div className="hidden md:block w-full flex flex-col mx-auto gap-4 px-6 box-content max-w-[1280px]">
      <h2 className="text-5 tracking-tight font-semibold leading-5 text-black mb-4">{ title }</h2>
      <h3 className="text-3.5 tracking-tight font-semibold leading-3.5 text-paragraph">{ subtitle }</h3>
    </div>
    <div className="mx-auto px-6 box-content max-w-[1280px]">
      { children }
    </div>
    <hr className="hidden md:block w-screen border-none bg-outline h-[1px]"/>
  </div>;
}

export default ContentHeader;