type ImageProps = {
  src: string;
  className: string
};

function Image({ src, className }: ImageProps) {
  return (
    <img
      src={src}
      alt="Nft Image"
      className={className}
    />
  );
}

export default Image;
