import PageContainer from '../../components/PageContainer';
import Empty from '../../components/Empty';
import CardSkeleton from '../../components/CardSkeleton';
import ContentHeader from '../../components/ContentHeader';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type MyAuctionsComponentProps = {
  loading: boolean,
  search: string,
  setSearch: (search: string) => void
  cards: string[],
}

function ExploreAuctionsComponent(props: MyAuctionsComponentProps) {
  const {
    loading,
    search,
    setSearch,
    cards,
  } = props;

  function renderCard(card: string, key: number) {
    //TODO AUC-4 Add card component
    // return <Card {...card}/>;
    return <span key={key}>{ card }</span>;
  }

  function renderCardSkeleton(ignore: null, key: number) {
    return <CardSkeleton key={key}/>;
  }

  function renderCards() {
    if(loading)
      return <div className="flex flex-wrap  gap-4 md:gap-6 w-full box-border">
        { [null, null, null, null].map(renderCardSkeleton) }
      </div>;
    if(search.length && !cards.length)
      return <Empty>There no results for that :(</Empty>;
    if(!cards.length)
      return <Empty>Looks Like no one is doing a auction, you can be one!</Empty>;
    return <div>
      { cards.map(renderCard) }
    </div>;
  }

  function renderSearchBar() {
    return <div className="relative flex flex-col mt-[2.5rem]">
      <input value={search} type="text"
             onChange={({target: { value }}) => setSearch(value)}
             placeholder="Search for an auction"
             className="bg-input rounded-sm placeholder:text-placeholder outline-none p-4 pl-10" />
      <MagnifyingGlassIcon className="h-6 w-6 absolute inset-0 right-auto"/>
    </div>;
  }

  return <>
    <ContentHeader
      title="Explore auctions"
      subtitle="Buy and sell NFTs">
      { renderSearchBar() }
    </ContentHeader>
    <PageContainer>
      { renderCards() }
    </PageContainer>
  </>;
}

export default ExploreAuctionsComponent;