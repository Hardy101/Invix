import { gifs } from "../constants/media";

const LoadingComponent: React.FC = () => {
  return (
    <div className="flex">
      <img src={gifs.loading} alt="loading gif" className="w-2/5 mx-auto" />
    </div>
  );
};

export default LoadingComponent;
