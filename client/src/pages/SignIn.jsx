import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import Oauth from "../components/Oauth";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const res = await axiosInstance.post("/auth/sign-in", formData);
      if (!res.data.success) {
        dispatch(signInFailure(res.data.message));
      }
      toast.success("Logged in successfully!");
      dispatch(signInSuccess(res.data.user));
      navigate("/");
    } catch (err) {
      console.error(err);
      dispatch(
        signInFailure(
          err.response?.data?.message ||
            "Something went wrong. Please try again."
        )
      );
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email"
          className="bg-white p-3 rounded-lg focus:outline-none"
          id="email"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="password"
          className="bg-white p-3 rounded-lg focus:outline-none"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <Oauth />
        {error && (
          <p className="text-red-500 text-center font-medium mt-2">{error}</p>
        )}
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700 font-semibold">Sign up</span>
        </Link>
      </div>
    </div>
  );
};

export default Signin;
