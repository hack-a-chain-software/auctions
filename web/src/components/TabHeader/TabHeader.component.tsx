import { Tab } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';

type TabHeaderProps = {
  title: string,
  tabList: string[],
  children: ReactNode[],
  onChange?: (index: number) => void,
  selectedIndex?: number
}

function TabHeader(props: TabHeaderProps) {
  const { title, tabList, children, onChange, selectedIndex } = props;

  function renderPanel(child: ReactNode, key: number) {
    return <Tab.Panel key={key}
                      tabIndex={-1}
                      className="box-content">
      { child }
    </Tab.Panel>;
  }

  function renderTab(tab:string, key:number) {
    return <Tab key={key} as={Fragment}>
      {({selected}) =>
        <button className={`relative outline-none flex items-end text-3.5 leading-3.5 text-black ${selected ? 'font-bolder pb-[9px] tracking-tighter' : 'font-semibold pb-2 tracking-tight'}`}>
          { tab }
          <hr className={`${selected ? '' : 'opacity-0'} transition-all absolute bottom-0 translate-y-[70%] shadow-tab shadow-sw-tab w-full h-1 bg-tab border-none rounded-full`}/>
        </button>
      }
    </Tab>;
  }

  return <div className="mt-[112px] overflow-x-hidden">
    <Tab.Group onChange={onChange} selectedIndex={selectedIndex}>
      <div className="w-full mx-auto px-6 box-content max-w-[1280px]">
        <h2 className="text-5 tracking-tight font-semibold leading-5 text-black">{ title }</h2>
        <Tab.List className="mt-[44px] flex gap-x-[26px] h-9">
          { tabList.map(renderTab) }
        </Tab.List>
      </div>
      <hr className="w-screen border-none bg-outline h-[1px]"/>
      <Tab.Panels>
        { children.map(renderPanel) }
      </Tab.Panels>
    </Tab.Group>
  </div>;
}

export default TabHeader;