import { ReactNode } from 'react';

type TabHeaderProps = {
  title: string,
  subtitle: string,
  children: ReactNode,
}

function ContentHeader(props: TabHeaderProps) {
  const { title, subtitle, children } = props;

  return <div className="mt-[112px] overflow-x-hidden">
    <div className="w-full mx-auto px-6 box-content max-w-[1280px]">
      <h2 className="text-5 tracking-tight font-semibold leading-5 text-black">{ title }</h2>
      <h3 className="text-5 tracking-tight font-semibold leading-5 text-black">{ subtitle }</h3>
    </div>
    <div>
      { children }
    </div>
    <hr className="w-screen border-none bg-outline h-[1px]"/>
  </div>;
}

export default ContentHeader;