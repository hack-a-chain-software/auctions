type ImageProps = {
  src: string;
};

function Image({ src }: ImageProps) {
  return (
    <img
      src={src}
      alt="Nft Image"
      className="w-[271px] h-[271px] object-cover rounded-[15px]"
    />
  );
}

export default Image;
