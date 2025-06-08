import { Link } from "react-router";
import { Plus, HelpCircleIcon, Bell, Settings2Icon } from "lucide-react";

// shadcn
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Local Imports
import { CreateEventFormProps } from "../../constants/interfaces";
import { icons } from "../../constants/media";
import { useAuth } from "../../context/AuthProvider";

const TopNavigation: React.FC<CreateEventFormProps> = ({
  setIsCreateEventActive,
}) => {
  const { user } = useAuth();

  return (
    <div className="relative nav text-sm py-4 px-8 border-b">
      <div className="w-full mobile-nav flex items-center gap-8 md:hidden">
        <Link to={"/home"} className="grow">
          <img
            src={icons.logo}
            alt="logo of invix"
            width={80}
            className="mr-auto"
          />
        </Link>
        {/* Notifications button */}
        <Link to={"#"}>
          <Bell width={"auto"} height={25} />
        </Link>
        <Link to={"#"}>
          <HelpCircleIcon width={"auto"} height={25} />
        </Link>
      </div>

      {/* Nav menu for lg screens */}
      <ul className="w-full hidden gap-6 items-center md:flex justify-between text-gray-1">
        <li>
          <Link to={"/home"}>
            <img src={icons.logo} alt="logo of invix" className="w-16 mr-8" />
          </Link>
        </li>

        <li>
          <Link to={"/home"} className="text-sm">
            Home
          </Link>
        </li>
        <li>
          <Link to={"/analytics"} className="text-sm">
            Analytics
          </Link>
        </li>
        <li>
          <Link to={"#"} className="text-sm">
            Help
          </Link>
        </li>

        <li className="ml-auto">
          <button
            onClick={() => setIsCreateEventActive(true)}
            className="grow flex items-center bg-primary rounded-lg text-white p-2 transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </button>
        </li>
        <li>
          <Link to={"#"} className="text-xl">
            <Settings2Icon width={"auto"} height={20} fill="currentColor" />
          </Link>
        </li>
        <li>
          <Link to={"#"} className="text-xl">
            <Bell width={"auto"} height={20} fill="currentColor" />
          </Link>
        </li>
        <li>
          <Link to={"/profile"} className="text-xl">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/images/profile-avatar.png" alt="Profile" />
              <AvatarFallback className="bg-purple-100 text-purple-600 text-lg">
                {user?.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default TopNavigation;
