import { Link, useNavigate } from "react-router";

// Local imports
import { profile } from "../constants/media";
import LogoutButton from "../components/logOutbutton";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();
  return (
    <div className="relative h-dvh p-4 md:p-8">
      <div className="nav flex gap-8 items-center text-sm">
        <button
          onClick={() => navigate(-1)}
          className="bs-2 rounded-xl bg-white text-primary p-3 hover:bg-primary hover:text-white"
        >
          <i className="fa-solid fa-left-long text-xl"></i>
        </button>

        <span className="font-ibmplex-bold text-xl">My profile</span>
      </div>

      <div className="body mt-10">
        <div className="profile-details">
          <div className="headInfo flex items-center flex-col gap-4 justify-between">
            <img
              src={profile}
              alt="profile picture of user"
              className="w-2/6 md:w-1/6"
            />
            <p className="grow grid gap-4">
              <span>@carminephalange</span>
            </p>
          </div>

          <ul className="grid gap-4 mt-10 text-sm">
            <li>
              <Link to={"#"} className="flex items-center gap-4">
                <i className="fa-solid fa-user text-primary bg-primary/10 p-2 text-sm rounded-full"></i>
                <span className="grow">Account settings</span>
                <i className="fa-solid fa-caret-right text-gray-1"></i>
              </Link>
            </li>
            <li>
              <Link to={"#"} className="flex items-center gap-4">
                <i className="fa-solid fa-shield-halved text-primary bg-primary/10 p-2 rounded-full"></i>
                <span className="grow">Security settings</span>
                <i className="fa-solid fa-caret-right text-gray-1"></i>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p
        id="acctActions"
        className="absolute w-full left-0 bottom-0 gap-4 p-4 text-sm"
      >
        <LogoutButton className="flex w-fit mx-auto bg-red py-3 px-16 rounded-md text-white font-poppins-bold" />
      </p>
    </div>
  );
};

export default Profile;
