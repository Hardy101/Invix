import { memo, useEffect, useRef } from "react";
import gsap from "gsap";
import { Link } from "react-router";

import Hr from "./hr";

import { useDropdownState } from "../store/useDropdownStore";
import { useModalState } from "../store/useModalStore";
import { useAuth } from "../context/AuthProvider";
import LogoutButton from "./logOutbutton";

const DropdownNav: React.FC = memo(() => {
  const { isAuthenticated } = useAuth();
  const dropdownref = useRef<HTMLDivElement | null>(null);
  const { isDropdownActive, setIsDropdownActive } = useDropdownState();
  const { setIsModalActive } = useModalState();

  useEffect(() => {
    if (!dropdownref.current) return;

    const ctx = gsap.context(() => {
      // Dropdown animation
      if (dropdownref) {
        if (isDropdownActive) {
          gsap.fromTo(
            dropdownref.current,
            { opacity: 0, y: 20, scale: 0.95, rotateX: -10 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 0.5,
              ease: "power2.out",
              pointerEvents: "auto",
            }
          );
        } else {
          gsap.to(dropdownref.current, {
            opacity: 0,
            y: 20,
            scale: 0.95,
            rotateX: -10,
            pointerEvents: "none",
            duration: 0.3,
            ease: "power2.in",
          });
        }
      }
    }, dropdownref);

    return () => ctx.revert();
  }, [isDropdownActive]);

  const handleDropdownClose = () => {
    setIsDropdownActive(false);
  }

  return (
    <div
      ref={dropdownref}
      className="w-full absolute flex top-15 left-0 z-4 opacity-0"
    >
      <div className="relative w-5/6 bg-[#225050] rounded-xl px-4 pt-10 pb-2 mx-auto md:w-2/5">
        <button
          onClick={handleDropdownClose}
          className="absolute flex bg-shadow text-secondary rounded-md px-2 py-1 text-xl right-4 top-4"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <ul className="text-secondary leading-7">
          <li className="hover:text-white">
            <Link to={"/profile"}>
              <span>Profile</span>
            </Link>
          </li>
          <li className="hover:text-white">
            <span>Analytics</span>
          </li>
        </ul>
        <Hr />
        <div className="actions flex items-center justify-between gap-6 text-xs mt-4">
          {/* <InstallButton /> */}
          <button
            onClick={() => {
              setIsModalActive(true), setIsDropdownActive(false);
            }}
            className="grow bg-shadow border border-shadow-2 rounded-full py-2 px-4 font-poppins-bold"
          >
            Add Event
          </button>
          {isAuthenticated && <LogoutButton />}
        </div>
      </div>
    </div>
  );
});

export default DropdownNav;
