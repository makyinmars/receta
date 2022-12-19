import ReactPlayer from "react-player";

const DynamicPlayer = () => {
  return (
    <div className="flex flex-col items-center justify-around gap-4 md:flex-row">
      <ReactPlayer
        controls={true}
        className="h-80 w-[500px] self-center rounded"
        url="https://www.youtube.com/watch?v=AcpqpzsELUE"
      />
      <ReactPlayer
        controls={true}
        className="h-80 w-[500px] self-center rounded"
        url="https://www.youtube.com/watch?v=7946ogTfAM4"
      />
    </div>
  );
};

export default DynamicPlayer;
