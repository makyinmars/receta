import ReactPlayer from "react-player";

const DynamicPlayer = () => {
  return (
    <div className="flex flex-col items-center justify-around gap-4 md:flex-row">
      <ReactPlayer
        width={350}
        controls={true}
        className="self-center rounded"
        url="https://www.youtube.com/watch?v=AcpqpzsELUE"
      />
      <ReactPlayer
        width={350}
        controls={true}
        className="h-80 self-center rounded"
        url="https://www.youtube.com/watch?v=7946ogTfAM4"
      />
    </div>
  );
};

export default DynamicPlayer;
