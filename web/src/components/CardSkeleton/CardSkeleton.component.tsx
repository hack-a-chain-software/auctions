function CardSkeleton() {
  return <div className="p-4 flex flex-col gap-4 w-auto md:w-[302px] bg-white/10 border-[1px] border-outline rounded-[28px] md:rounded-large animate-skeleton-body">
    <div className="w-full aspect-square rounded-sm md:rounded bg-black/10 animate-skeleton-img"/>
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex justify-between">
        <div className="h-4 w-[120px] rounded-full bg-black/10 animate-skeleton-text"/>
      </div>
      <div className="hidden md:flex justify-between">
        <div className="h-4 w-[100px] rounded-full bg-black/10 animate-skeleton-text"/>
        <div className="h-4 w-[80px] rounded-full bg-black/10 animate-skeleton-text"/>
      </div>
      <div className="hidden md:flex justify-between">
        <div className="h-4 w-[100px] rounded-full bg-black/10 animate-skeleton-text"/>
        <div className="h-4 w-[90px] rounded-full bg-black/10 animate-skeleton-text"/>
      </div>
      <div className="flex justify-between">
        <div className="h-4 w-[100px] md:w-[140px] rounded-full bg-black/10 animate-skeleton-text"/>
      </div>
    </div>
    <div className="hidden md:block w-full h-10 rounded bg-[rgba(0,0,0,.05)] animate-skeleton-img"/>
  </div>;
}

export default CardSkeleton;