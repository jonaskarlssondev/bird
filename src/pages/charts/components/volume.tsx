const Volume: React.FC<{ data: number[] }> = (props) => {
  const maxVol = Math.max(...props.data);
  const minVol = Math.max(0, Math.min(...props.data));

  return (
    <div className="flex h-12 w-full flex-row-reverse items-end">
      {props.data.map((x, i) => {
        // Max height is 48, min height is 4. Compute height as percentage of max and min
        const height = (44 * x) / (maxVol - minVol);

        const style = {
          height: height + "px",
        };

        return (
          <div key={i} style={style} className="ml-[1px] w-[5px] bg-gray-500"></div>
        );
      })}
    </div>
  );
};

export default Volume;
