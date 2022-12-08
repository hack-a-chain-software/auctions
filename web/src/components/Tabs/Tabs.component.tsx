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
    return <Tab.Panel key={key} tabIndex={-1}>
      { child }
    </Tab.Panel>;
  }

  function renderTab(tab:string, key:number) {
    return <Tab key={key} tabIndex={-1}>
      {({selected}) =>
        <button className={selected ? 'selected' : ''}>
          { tab }
        </button>
      }
    </Tab>;
  }

  return <div>
    <Tab.Group onChange={onChange} selectedIndex={selectedIndex}>
      <div className="flex justify-between">
        <Tab.List>
          { tabList.map(renderTab) }
        </Tab.List>
        { rightBar }
      </div>
      <Tab.Panels>
        { children.map(renderPanel) }
      </Tab.Panels>
    </Tab.Group>
  </div>;
}

export default Tabs;