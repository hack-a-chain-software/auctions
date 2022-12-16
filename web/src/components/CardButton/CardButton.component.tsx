type ButtonProps = {
  isWon: boolean;
  isClose: boolean;
  firstPlace: boolean;
  isOwner: boolean;
  offered: boolean;
  outbid: boolean;
  onClick: () => void
  disabled: boolean
};

function CardButton({
  isWon,
  isClose,
  firstPlace,
  isOwner,
  offered,
  outbid,
  onClick,
  disabled
}: ButtonProps) {
  function MakeOfferButton() {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`hidden md:block w-[265px] h-10 ml-[1px] rounded font-medium text-sm leading-3.5 tracking-normal text-white bg-button
  `}
      >
        Make offer
      </button>
    );
  }

  function ViewDetailsButton() {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`hidden md:block w-[265px] h-10 ml-[1px] mt-3 rounded font-medium text-sm leading-3.5 tracking-normal text-white bg-button`}
      >
        View details
      </button>
    );
  }

  function ViewAuctionButton() {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`hidden md:block w-[265px] h-10 ml-[1px] mt-[2px] rounded font-medium text-sm leading-2.5 tracking-normal text-white  bg-button`}
      >
        View auctions
      </button>
    );
  }

  function SeeOfferButton() {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`hidden md:block w-[265px] h-10 ml-[1px] mt-[-6px] rounded font-medium text-sm leading-3.5 tracking-normal text-white bg-button`}
      >
        See offers
      </button>
    );
  }

  function ClaimRewardsButton() {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`hidden md:block w-[265px] h-10 ml-[1px] mt-4 rounded font-medium text-sm leading-3.5 tracking-normal text-white bg-space`}
      >
        Claim rewards
      </button>
    );
  }

  if (offered && firstPlace) {
    return <MakeOfferButton />;
  }
  if (offered && outbid) {
    return <MakeOfferButton />;
  }

  if (offered) {
    return <ViewAuctionButton />;
  }

  if (isOwner && isClose) {
    return <SeeOfferButton />;
  }

  if (isOwner) {
    return <SeeOfferButton />;
  }

  if (isClose) {
    return <ViewDetailsButton />;
  }

  if (isWon) {
    return <ClaimRewardsButton />;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`hidden md:block w-[265px] h-10 ml-[1px] mt-[10px] rounded font-medium text-sm leading-3.5 tracking-normal text-white bg-button
      `}
    >
      Make offer
    </button>
  );
}

export default CardButton;
