import PageContainer from '../../components/PageContainer';
import TabHeader from '../../components/TabHeader';
import Tabs from '../../components/Tabs';
import { PlusIcon } from '@heroicons/react/24/outline';
import Empty from '../../components/Empty';

type MyAuctionsComponentProps = {
  indexTabHeader: number,
  onSwitchTabHeader: (index: number) => void,
  onSwitchTabMyOffers: (index: number) => void,
  onSwitchTabMyCreated: (index: number) => void,
  loading: boolean,
  cards: string[],
  createPanel: boolean
  showCreatePanel: (show: boolean) => void
}

function MyAuctionsComponent(props: MyAuctionsComponentProps) {
  const {
    indexTabHeader,
    onSwitchTabHeader,
    onSwitchTabMyOffers,
    onSwitchTabMyCreated,
    loading,
    cards,
    createPanel,
    showCreatePanel
  } = props;

  function renderCard(card: string, key: number) {
    //TODO AUC-4 Add card component
    // return <Card {...card}/>;
    return <span key={key}>{ card }</span>;
  }

  function renderCardSkeleton(ignore: null, key: number) {
    return <div key={key} className="p-4 flex flex-col gap-4 w-[302px] bg-white/10 border-[1px] border-outline rounded-large animate-skeleton-body">
      <div className="w-full aspect-square rounded bg-black/10 animate-skeleton-img"/>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between">
          <div className="h-4 w-[120px] rounded-full bg-black/10 animate-skeleton-text"/>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-[100px] rounded-full bg-black/10 animate-skeleton-text"/>
          <div className="h-4 w-[80px] rounded-full bg-black/10 animate-skeleton-text"/>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-[100px] rounded-full bg-black/10 animate-skeleton-text"/>
          <div className="h-4 w-[90px] rounded-full bg-black/10 animate-skeleton-text"/>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-[140px] rounded-full bg-black/10 animate-skeleton-text"/>
        </div>
      </div>
      <div className="w-full h-10 rounded bg-[rgba(0,0,0,.05)] animate-skeleton-img"/>
    </div>;
  }

  function renderCards(emptyMessage: string) {
    if(loading)
      return <div className="flex flex-wrap gap-6 w-full box-border">
        { [null, null, null, null].map(renderCardSkeleton) }
      </div>;
    if(!cards.length)
      return <Empty>{ emptyMessage }</Empty>;
    return <div>
      { cards.map(renderCard) }
    </div>;
  }

  function renderCreateAuctionButton() {
    return <button onClick={() => showCreatePanel(true)}
                   className="flex gap-2.5 rounded items-center px-4 h-10 bg-button text-3.5 translate-y-[4px] leading-3.5 tracking-tight font-semibold text-white">
      <PlusIcon className="h-4 w-4 stroke-white opacity-100"/>
      Create Auction
    </button>
  }

  function renderMyOffersPanel() {
    return <PageContainer>
      <Tabs tabList={['Auctions live', 'Closed auctions', 'Auctions won']}
                   onChange={onSwitchTabMyOffers}>
        {[
          renderCards('The auctions in progress that you birded will appear here'),
          renderCards('When a auctions your birded close without you winning, they will be listed here'),
          renderCards('When you win a auction, it will appear here')
        ]}
      </Tabs>
    </PageContainer>;
  }

  function renderMyCreatedPanel() {
    return <PageContainer>
      <Tabs tabList={['Your auctions live', 'Your closed auctions']}
            rightBar={renderCreateAuctionButton()}
            onChange={onSwitchTabMyCreated}>
        {[
          renderCards('The open auctions you create will be listed here'),
          renderCards('The closed auctions you created will be listed here.')
        ]}
      </Tabs>
    </PageContainer>;
  }

  return <>
    {/*TODO AUC-5 Add CreateAuction panel
      * <CreateAuction open={createPanel} onClose={() => showCreatePanel(false)} />*/}
    <TabHeader
      title="My Auctions"
      tabList={['My offers', 'Created auctions']}
      selectedIndex={indexTabHeader}
      onChange={onSwitchTabHeader}>
      {[
        renderMyOffersPanel(),
        renderMyCreatedPanel()
      ]}
    </TabHeader>
  </>;
}

export default MyAuctionsComponent;