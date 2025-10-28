import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { signInSuccess } from "../redux/user/userSlice";

const AuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const userString = params.get("user");

      if (!token || !userString) {
        toast.error("Google login failed!");
        navigate("/sign-in");
        return;
      }

      const user = JSON.parse(decodeURIComponent(userString));

      // save token (optional)
      localStorage.setItem("access_token", token);

      // save user in Redux
      dispatch(signInSuccess(user));

      toast.success(`Welcome, ${user.username || user.email}!`);
      navigate("/");
    } catch (error) {
      console.error("AuthSuccess error:", error);
      toast.error("Something went wrong!");
      navigate("/sign-in");
    }
  }, [dispatch, navigate, location]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg font-semibold text-gray-700">Signing you in...</p>
    </div>
  );
};

export default AuthSuccess;
