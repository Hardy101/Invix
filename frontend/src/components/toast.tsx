import Portal from "./portal";
import { useToastStore, ToastType } from "../store/useToastStore";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const ToastNotification = () => {
  const { isToastActive, setIsToastActive, text, subtext, type } =
    useToastStore();
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isToastActive && toastRef.current) {
      // Pop-up animation
      gsap.fromTo(
        toastRef.current,
        { y: 100, opacity: 0, scale: 0.4 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [isToastActive]);

  if (!isToastActive) return null;

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return "fa-check";
      case "failure":
        return "fa-xmark";
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "border-green text-green-500";
      case "failure":
        return "border-red text-red";
    }
  };

  const getTextColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "text-green";
      case "failure":
        return "text-red";
    }
  };

  return (
    <Portal>
      <div
        ref={toastRef}
        className="fixed top-8 left-0 w-full md:pr-10 bg-opacity-50 z-50"
      >
        <div className="bg-white w-4/5 md:w-2/5 p-4 rounded shadow-lg flex items-center justify-between gap-4 mx-auto md:ml-auto">
          <i
            className={`fa-solid ${getIcon(
              type
            )} font-bold mt-1 p-1 rounded-full border-2 ${getBorderColor(
              type
            )} text-xs mb-auto`}
          ></i>
          <p className="grow grid">
            <span className={`font-poppins-medium ${getTextColor(type)}`}>
              {text}
            </span>
            <span className="font-poppins text-sm">{subtext}</span>
          </p>
          <button
            onClick={() => setIsToastActive(false)}
            className="text-xs hover:text-red font-poppins-bold"
          >
            Close
          </button>
        </div>
      </div>
    </Portal>
  );
};

export default ToastNotification;
