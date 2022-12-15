type NFTComponentProps = {
  checked: boolean
  image: string,
  collection: string,
  id: string
};

function NFTComponent(props: NFTComponentProps) {
  const {
    checked,
    image,
    collection,
    id
  } = props;

  return (
    <>
      <div
        className={`p-[.17rem] w-[175px] h-[180px] shadow shadow-transparent ${
          checked
            ? "bg-space shadow-button/[.25]"
            : "bg-transparent"
        } rounded-md hover:shadow-button/[.25]`}
      >
        <img
          src={image}
          alt={`${collection} - ${id}`}
          className="w-[171px] h-[175px] object-cover rounded-[10px] hover:drop-shadow-xl outline-none"
        />
      </div>
      <div className="flex flex-col justify-center absolute backdrop-blur-cover bg-white/80 bottom-3 rounded h-[46px] w-[149px] left-[.8rem]">
        <h3 className="text-black font-bold text-sm ml-4 tracking-tight">
          { collection }
        </h3>
        <span className="text-black font-bold text-sm ml-4 tracking-tight">
          { id }
        </span>
      </div>
    </>
  );
}

export default NFTComponent;
