import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEventStore } from "../store/useEventsStore";
import { useDropdownState } from "../store/useDropdownStore";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  classNames?: string;
}

const LogoutButton: React.FC<ButtonProps> = ({ classNames, ...props }) => {
  const { logout } = useAuth();
  const { clearEvents } = useEventStore();
  const { setIsDropdownActive } = useDropdownState();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();

    if (success) {
      clearEvents();
      setIsDropdownActive(false);
      navigate("/");
    } else {
      console.error("Logout failed. Not navigating.");
    }
  };

  return (
    <button className={classNames || ""} onClick={handleLogout} {...props}>
      Sign out
    </button>
  );
};

export default LogoutButton;
