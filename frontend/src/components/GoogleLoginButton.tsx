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

      if (res.data) {
        login();
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "success",
          text: "Authentication successful",
          subtext: "You have been successfully logged in to your account.",
        });
        navigate("/home");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      useToastStore.getState().setToastState({
        isToastActive: true,
        type: "failure",
        text: "Authentication failed",
        subtext: err.response?.data?.detail || "Please try again later.",
      });
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "failure",
          text: "Google login failed",
          subtext: "Please try again or use email login.",
        });
      }}
      shape="pill"
    />
  );
};

export default GoogleAuthButton;
