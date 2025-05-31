import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

import { url } from "../constants/variables";
import { useAuth } from "../context/AuthProvider";
import { useToastStore } from "../store/useToastStore";
import { icons } from "../constants/media";
import GoogleAuthButton from "../components/GoogleLoginButton";

interface formData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [focusedFields, setFocusedFields] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [formData, setFormData] = useState<formData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email: string;
    password: string;
    general: string;
  }>({
    email: "",
    password: "",
    general: "",
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = { name: "", email: "", password: "", general: "" };

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (prev[name as keyof formData] === value) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await axios.post(`${url}/auth/login`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        login();
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "success",
          text: "Login successful",
          subtext: "You have been successfully logged in to your account.",
        });
        navigate("/home");
      } catch (err: any) {
        console.error("Login error", err);
        setErrors((prev) => ({
          ...prev,
          general:
            err?.response?.data?.detail ||
            "Something went wrong, please fill the form again",
        }));
      }
    }
  };

  const formFieldClasses =
    "block w-full bg-white font-poppins-medium placeholder:text-black placeholder:font-poppins text-sm p-5 focus:outline-primary";
  const FloatingInputSpanClass =
    "absolute left-2 flex items-center font-poppins-bold gap-2 pr-2 text-[0.8rem] transition-all duration-400 ease-in-out bg-white";

  return (
    <section className="relative min-h-screen py-16 flex flex-col gap-4 text-center">
      <img
        src={icons.floatingqrcode}
        alt="floating image of qrcode"
        className="w-3/4 absolute right-0 top-0"
      />
      <div className="md:w-2/5 px-8 md:mx-auto mt-auto z-10">
        <h1 className="relative flex gap-4 items-center">
          <img src={icons.logo} alt="logo of invix" className="w-32" />
          <span className="text-4xl md:text-5xl font-dmserif">
            Welcome back
          </span>
        </h1>
        <form onSubmit={handleSubmit} className="grid gap-8 mt-12 mx-auto">
          <div className="form-control">
            <GoogleAuthButton />
          </div>
          <div className="form-control flex items-center gap-4">
            <hr className="grow border border-gray-400"/>
            <span className="text-gray-600">or continue with email</span>
            <hr className="grow border border-gray-400"/>
          </div>
          {errors.general && (
            <p className="error-msg flex items-center gap-2 bg-red-300 text-red-500 text-xs rounded-md p-2 ">
              <i className="fa-solid fa-triangle-exclamation text-lg"></i>
              <span>{errors.general}</span>
            </p>
          )}

          {/* === EMAIL FIELD === */}
          <div className="relative form-control grid gap-2">
            <p
              style={{ pointerEvents: "none" }}
              className={`${FloatingInputSpanClass} ${
                focusedFields.email || formData.email.trim()
                  ? "-top-5 text-black"
                  : "top-1/2 left-15 -translate-x-1/2 -translate-y-1/2 text-gray-1"
              }`}
            >
              <span className="inline-flex text-white bg-black rounded-full p-[0.4rem]">
                <i className="fa-solid fa-user text-[0.7rem]"></i>
              </span>
              <label htmlFor="email">Email</label>
            </p>
            <input
              type="text"
              name="email"
              id="email"
              value={formData.email.toLowerCase().trim()}
              onChange={handleChange}
              onFocus={() => setFocusedFields((f) => ({ ...f, email: true }))}
              onBlur={() => setFocusedFields((f) => ({ ...f, email: false }))}
              className={`${formFieldClasses} ${
                errors.email ? "border-2 border-red" : "border border-shadow"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-poppins-medium text-left">
                {errors.email}
              </p>
            )}
          </div>
          {/* === END OF EMAIL FIELD === */}

          {/* === PASSWORD FIELD === */}
          <div className="relative form-control grid gap-2">
            <p
              style={{ pointerEvents: "none" }}
              className={`${FloatingInputSpanClass} ${
                focusedFields.password || formData.password.trim()
                  ? "-top-5 text-black"
                  : "top-1/2 left-18 -translate-x-1/2 -translate-y-1/2 text-gray-1"
              }`}
            >
              <span className="inline-flex text-white bg-black rounded-full p-[0.4rem]">
                <i className="fa-solid fa-key text-[0.7rem]"></i>
              </span>
              <label htmlFor="password">Password</label>
            </p>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password.trim()}
              onChange={handleChange}
              onFocus={() =>
                setFocusedFields((f) => ({ ...f, password: true }))
              }
              onBlur={() =>
                setFocusedFields((f) => ({ ...f, password: false }))
              }
              className={`${formFieldClasses} ${
                errors.password ? "border-2 border-red" : "border border-shadow"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs font-poppins-medium text-left">
                {errors.password}
              </p>
            )}
          </div>
          {/* === END OF PASSWORD FIELD === */}
          <button className="flex items-center text-center font-poppins-bold mt-4">
            <hr className="grow border border-gray-2" />
            <span className="px-6">Login</span>
            <span className="relative bg-primary py-6 px-6 rounded-r-full">
              <i className="fa-solid fa-arrow-right absolute text-2xl text-white left-0 top-1/2 -translate-y-1/2"></i>
            </span>
          </button>
          <div className="font-poppins">
            I Don't have an account. I want to{" "}
            <Link to={"/register"} className="text-primary font-poppins-bold">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
