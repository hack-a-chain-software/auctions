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
      return <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 w-full box-border">
        { [null, null, null, null].map(renderCardSkeleton) }
      </div>;
    if(search.length && !cards.length)
      return <Empty>There no results for that :(</Empty>;
    if(!cards.length)
      return <Empty>Looks Like no one is doing a auction, you can be one!</Empty>;
    return <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 w-full box-border">
      { cards.map(renderCard) }
    </div>;
  }

  function renderSearchBar() {
    return <div className="relative flex flex-col mt-[84px] md:mt-[79px] mb-[31px] md:mb-[47px] w-full">
      <input value={search} type="text"
             onChange={({target: { value }}) => setSearch(value)}
             placeholder="Search for an auction"
             className="bg-input rounded-sm placeholder:text-placeholder outline-none pr-4 pt-3.5 pb-3 text-paragraph pl-[58px] text-3 leading-3 tracking-tight font-semibold" />
      <MagnifyingGlassIcon className="h-5 w-5 absolute top-2.5 left-4 stroke-paragraph/70"/>
    </div>;
  }

  return <>
    <ContentHeader
      title="Explore auctions"
      subtitle="Buy and sell NFTs">
      { renderSearchBar() }
    </ContentHeader>
    <PageContainer>
      <div className="px-6 pt-10">
        { renderCards() }
      </div>
    </PageContainer>
  </>;
}

export default ExploreAuctionsComponent;