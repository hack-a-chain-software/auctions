import TabHeader from '../../components/TabHeader';
import Tabs from '../../components/Tabs';
import { PlusIcon } from '@heroicons/react/24/outline';
import Empty from '../../components/Empty';
import CardsContainer from '../../components/CardsContainer';
import CardSkeleton from '../../components/CardSkeleton';
import CreateAuction from '../../components/CreateAuction';
import Card from '../../components/Card';
import { Auction } from 'contract_aptos';

type MyAuctionsComponentProps = {
  indexTabHeader: number,
  onSwitchTabHeader: (index: number) => void,
  onSwitchTabMyOffers: (index: number) => void,
  onSwitchTabMyCreated: (index: number) => void,
  loading: boolean,
  cards: Auction[],
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

  function renderCard(card: Auction, key: number) {
    return <Card key={key} {...card}/>;
  }

  function renderCardSkeleton(ignore: null, key: number) {
    return <CardSkeleton key={key}/>;
  }

  function renderCards(emptyMessage: string) {
    if(loading)
      return <CardsContainer>
        { [null, null, null, null].map(renderCardSkeleton) }
      </CardsContainer>;
    if(!cards.length)
      return <Empty>{ emptyMessage }</Empty>;
    return <CardsContainer>
      { cards.map(renderCard) }
    </CardsContainer>;
  }

  function renderCreateAuctionButton() {
    return <button onClick={() => showCreatePanel(true)}
                   className="fixed sm:relative bottom-4 right-4 sm:inset-auto z-[10] flex gap-2.5 rounded-large sm:rounded items-center justify-center w-10 smaller:w-auto smaller:pr-5 smaller:pl-4 sm:px-4 h-10 bg-button text-3.5 translate-y-[4px] leading-3.5 tracking-tight font-semibold text-white">
      <PlusIcon className="h-5 w-5 smaller:h-4 smaller:w-4 stroke-white opacity-100"/>
      <span className="hidden smaller:inline">Create Auction</span>
    </button>
  }

  function renderMyOffersPanel() {
    return <Tabs tabList={['Auctions live', 'Closed auctions', 'Auctions won']}
            onChange={onSwitchTabMyOffers}>
        {[
          renderCards('The auctions in progress that you birded will appear here'),
          renderCards('When a auctions your birded close without you winning, they will be listed here'),
          renderCards('When you win a auction, it will appear here')
        ]}
      </Tabs>;
  }

  function renderMyCreatedPanel() {
    return <Tabs tabList={['Your auctions live', 'Your closed auctions']}
            rightBar={renderCreateAuctionButton()}
            onChange={onSwitchTabMyCreated}>
        {[
          renderCards('The open auctions you create will be listed here'),
          renderCards('The closed auctions you created will be listed here.')
        ]}
      </Tabs>;
  }

  return <>
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
    <CreateAuction open={createPanel} setOpen={showCreatePanel} />
  </>;
}

export default MyAuctionsComponent;