import { Tab } from '@headlessui/react';
import { ReactNode } from 'react';

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
    <h2>{ title }</h2>
    <Tab.Group onChange={onChange} selectedIndex={selectedIndex}>
      <Tab.List>
        { tabList.map(renderTab) }
      </Tab.List>
      <Tab.Panels>
        { children.map(renderPanel) }
      </Tab.Panels>
    </Tab.Group>
  </div>;
}

export default TabHeader;