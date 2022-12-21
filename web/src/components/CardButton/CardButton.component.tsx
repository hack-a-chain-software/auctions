type ButtonProps = {
  live: boolean,
  noBids: boolean,
  won: boolean,
  iBided: boolean,
  created: boolean,
  explore: boolean,
  onClick: () => void,
  disabled: boolean
};

function CardButton({
  live, // If auction is closed of live
  noBids, // If the auction has no bids
  won, // If the logged account won the auction
  iBided, // If the logged account made an offer/bid
  created, // If the card is on the created page
  explore, // If the card is on the explore page
  onClick,
  disabled
}: ButtonProps) {

  function MakeOfferButton() {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="disabled:bg-disabled hidden md:block w-[265px] h-10 ml-[1px] rounded font-medium text-sm leading-3.5 tracking-normal text-white bg-button"
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
        className="disabled:bg-disabled hidden md:block w-[265px] h-10 ml-[1px] mt-3 rounded font-medium text-sm leading-3.5 tracking-normal text-white bg-button"
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
        className="disabled:bg-disabled hidden md:block w-[265px] h-10 ml-[1px] mt-[2px] rounded font-medium text-sm leading-2.5 tracking-normal text-white  bg-button"
      >
        View auction
      </button>
    );
  }

  function SeeOffersButton() {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="disabled:bg-disabled hidden md:block w-[265px] h-10 ml-[1px] mt-[-6px] rounded font-medium text-sm leading-3.5 tracking-normal text-white bg-button"
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
        className="bg-space disabled:bg-none disabled:bg-disabled hidden md:block w-[265px] h-10 ml-[1px] mt-4 rounded font-medium text-sm leading-3.5 tracking-normal text-white"
      >
        { disabled ? 'Already claimed' : 'Claim rewards' }
      </button>
    );
  }

  function WithdrawOffersButton() {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="disabled:bg-disabled hidden md:block w-[265px] h-10 ml-[1px] mt-[-6px] rounded font-medium text-sm leading-3.5 tracking-normal text-white bg-button"
      >
        { disabled ? 'Already claimed' : 'Withdraw offers' }
      </button>
    );
  }

  function ClaimBackTokenButton() {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="disabled:bg-disabled hidden md:block w-[265px] h-10 ml-[1px] mt-[-6px] rounded font-medium text-sm leading-3.5 tracking-normal text-white bg-button"
      >
        { disabled ? 'Already claimed' : 'Claim back token' }
      </button>
    );
  }

  return <>
    {/* If user is on the created page */}
    { created
      ? (live
        ? <SeeOffersButton/>
        : (noBids
          ? <ClaimBackTokenButton/>
          : <WithdrawOffersButton/>
        )
      )
      : <></> }

    {/* If user is on the explore page */}
    { explore
      ? (live
        ? ( iBided ? <ViewAuctionButton/> : <MakeOfferButton/>)
        : <ViewDetailsButton/>
      )
      : <></> }

    {/* If user is on the myOffers page */}
    { !created && !explore
      ? (live
        ? <MakeOfferButton/>
        : (won
          ? <ClaimRewardsButton/>
          : <ViewDetailsButton/>
        )
      )
      : <></> }
  </>;
}

export default CardButton;
