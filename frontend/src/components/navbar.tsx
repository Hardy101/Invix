import { Link, useLocation } from "react-router-dom";

const navClass = "flex gap-2 items-center px-4 py-2 rounded-full";

const navLinks = [
  { id: 0, text: "Home", path: "/home", icon: "fa-solid fa-house" },
  {
    id: 1,
    text: "Analytics",
    path: "/analytics",
    icon: "fa-solid fa-chart-pie",
  },
  { id: 2, text: "Settings", path: "#", icon: "fa-solid fa-gears" },
  { id: 3, text: "Profile", path: "/profile", icon: "fa-solid fa-user" },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed w-full left-0 bottom-0 p-4 md:hidden z-5">
      <ul className="w-fit bg-black rounded-full py-2 px-2 text-white flex items-center justify-between">
        {navLinks.map((link) => (
          <li key={link.id}>
            <Link
              to={link.path}
              className={`${navClass} ${
                currentPath == link.path ? "bg-primary" : ""
              }`}
            >
              <i className={link.icon}></i>
              {currentPath == link.path && <span>{link.text}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
