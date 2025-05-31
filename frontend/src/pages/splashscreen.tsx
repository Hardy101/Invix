import { Link } from "react-router";
import { img } from "../constants/media";
import { useState, useEffect } from "react";

const carousel_imgs = [
  { id: 0, src: img.bd },
  { id: 1, src: img.conference },
  { id: 2, src: img.meeting },
];
const SplashScreen = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((current) => (current + 1) % carousel_imgs.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col gap-y-8 py-24 text-center">
      <div className="progress flex gap-2 mx-auto">
        {carousel_imgs.map((_, index) => (
          <span
            key={index}
            className={`w-16 h-1 rounded-full ${
              index === activeStep ? "bg-primary" : "bg-primary/30"
            }`}
          ></span>
        ))}
      </div>
      <h1 className="font-dmserif text-4xl px-4">
        Manage your guests and track every Check-in
      </h1>
      <div className="grow w-fit overflow-clip">
        {carousel_imgs
          .filter((img) => img.id == activeStep)
          .map((img) => (
            <img
              key={img.id}
              src={img.src}
              alt="image carousel"
              className="w-4/5 mx-auto rounded-t-full md:w-1/5"
            />
          ))}
      </div>
      <div className="flex flex-col justify-end text-center gap-4 font-poppins-medium">
        <Link
          to={"/register"}
          className="w-4/5 md:w-2/5 bg-primary text-white rounded-2xl px-6 py-4 mx-auto"
        >
          <span>Create account</span>
        </Link>
        <Link
          to={"/login"}
          className="w-4/5 md:w-2/5 bg-black text-white rounded-2xl px-6 py-4 mx-auto"
        >
          <span>Sign in</span>
        </Link>
      </div>
      <div className="agreement flex gap-8 font-poppins-medium mx-auto">
        <span>User terms</span>
        <span>Privacy</span>
      </div>
    </div>
  );
};

export default SplashScreen;
