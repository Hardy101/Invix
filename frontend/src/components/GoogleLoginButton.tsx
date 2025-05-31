import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";

import { url } from "../constants/variables";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useToastStore } from "../store/useToastStore";

const GoogleAuthButton = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const res = await axios.post(
        `${url}/auth/google`,
        { token },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(res.data);
      login();
      useToastStore.getState().setToastState({
        isToastActive: true,
        type: "success",
        text: "Authentication successful",
        subtext: "You have been successfully logged in to your account.",
      });
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
      shape="pill"
    />
  );
};

export default GoogleAuthButton;
