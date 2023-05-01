const CurrentPrice: React.FC<{
  price?: number;
  ppc: number;
  max: number;
}> = (props) => {
  if (!props.price) {
    return <></>;
  }

  const margin = props.ppc * (props.max - props.price);

  const style = {
    marginTop: margin + "px",
  };

  return (
    <div style={style} className="absolute flex flex-row">
      <div className="h-px w-2 bg-red-500"></div>
      <p className="ml-1 mt-[-7px] text-xs">
        {Math.round((props.price + Number.EPSILON) * 100) / 100}
      </p>
    </div>
  );
};

export default CurrentPrice;
