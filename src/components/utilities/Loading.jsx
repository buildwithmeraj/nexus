import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../../assets/Loader.json";

const Loading = () => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-base-100/60 backdrop-blur-[2px] rounded-lg">
      <div className="absolute inset-0 bg-base-100/60 backdrop-blur-[2px]" />
      <div className="relative z-10 flex flex-col items-center justify-center">
        <Lottie
          animationData={loaderAnimation}
          loop={true}
          autoplay={true}
          style={{ width: 200, height: 200 }}
        />
        <p className="text-center text-base-content/70 font-medium mt-2">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;
