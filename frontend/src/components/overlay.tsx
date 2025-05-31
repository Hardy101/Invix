import { useRef, useEffect, memo } from "react";
import { useDropdownState } from "../store/useDropdownStore";
import { useModalState } from "../store/useModalStore";

import gsap from "gsap";

const Overlay = memo(() => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const { isDropdownActive } = useDropdownState();
  const { isModalActive } = useModalState();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isDropdownActive || isModalActive) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            onStart: () => {
              overlayRef.current &&
                (overlayRef.current.style.pointerEvents = "auto");
            },
          }
        );
      } else {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            overlayRef.current &&
              (overlayRef.current.style.pointerEvents = "none");
          },
        });
      }
    }, overlayRef);

    return () => {
      ctx.revert();
    };
  }, [isDropdownActive, isModalActive]);

  return (
    <div
      ref={overlayRef}
      className="absolute bg-white w-full h-full top-0 left-0 z-3"
      style={{ pointerEvents: "none" }}
    ></div>
  );
});

export default Overlay;
