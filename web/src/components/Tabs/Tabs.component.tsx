import { Tab } from '@headlessui/react';
import { ReactNode } from 'react';

type TabsProps = {
  tabList: string[],
  children: ReactNode[],
  onChange?: (index: number) => void,
  selectedIndex?: number,
  rightBar?: ReactNode
}

function Tabs(props: TabsProps) {
  const { tabList, children, onChange, selectedIndex, rightBar } = props;

  function renderPanel(child: ReactNode, key: number) {
    return <Tab.Panel key={key} tabIndex={-1} className="mt-8 md:mt-10 outline-none px-6 box-content">
      { child }
    </Tab.Panel>;
  }

  function renderTab(tab:string, key:number) {
    return <Tab key={key} tabIndex={-1} className="outline-none">
      {({selected}) =>
        <button className={`w-max rounded py-2.5 px-4 text-3.5 leading-3.5 tracking outline-none ${selected ? 'bg-gd-button text-white font-bold' : 'border-outline border-[1px] font-semibold text-black'}`}>
          { tab }
        </button>
      }
    </Tab>;
  }

  return <div className="w-full">
    <Tab.Group onChange={onChange} selectedIndex={selectedIndex}>
      <div className="flex gap-4 sm:gap-4 py-0 items-end h-[78px]">
        <div className="flex justify-between gap-4 sm:gap-4 py-0 items-end w-full flex-wrap mx-auto px-6 box-content max-w-[1280px]">
          <Tab.List className="flex gap-4 box-content overflow-x-scroll scrollbar-hide">
            { tabList.map(renderTab) }
          </Tab.List>
          { rightBar }
        </div>
      </div>
      <Tab.Panels>
        { children.map(renderPanel) }
      </Tab.Panels>
    </Tab.Group>
  </div>;
}

export default Tabs;