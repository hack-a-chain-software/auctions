import PageContainer from "../PageContainer";

function AuctionSkeleton() {
  return (
    <PageContainer>
      <section className="flex flex-col items-center mt-12 gap-8 md:flex-row md:items-start xl:justify-between">
        <section className="w-full flex flex-col items-center gap-8 xl:items-start xl:w-[413px]">
          <div className="bg-white/30 relative h-[370px] w-[95%] max-w-[413px] animate-skeleton-body rounded-md">
            <div className="bg-white/40 animate-skeleton-body p-10 rounded-md absolute bottom-10 w-[95%] left-[.6rem] md:hidden"></div>
          </div>
          <div className="w-[95%] max-w-[413px] flex flex-col gap-6">
            <div className="bg-white/30 h-5 w-[170px] animate-skeleton-body rounded-md"></div>
            <div className="bg-white/30 h-[150px] w-full animate-skeleton-body rounded-md"></div>
          </div>
          <div className="bg-white/30 relative h-[370px] w-[95%] max-w-[413px] animate-skeleton-body rounded-md"></div>
        </section>
        <section className="flex flex-col w-full items-center gap-8 xl:w-[761px] xl:items-end">
          <div className="bg-white/30 relative h-[370px] w-[95%] max-w-[413px] animate-skeleton-body rounded-md xl:max-w-full xl:h-[270px] xl:mb-24"></div>
          <div className="bg-white/30 relative h-[370px] w-[95%] max-w-[413px] animate-skeleton-body rounded-md xl:max-w-full"></div>
          <div className="hidden md:block bg-white/30 relative h-[370px] w-[95%] max-w-[413px] animate-skeleton-body rounded-md xl:max-w-full"></div>
        </section>
      </section>
    </PageContainer>
  );
}

export default AuctionSkeleton;
