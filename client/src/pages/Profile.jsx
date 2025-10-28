import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { signInSuccess } from "../redux/user/userSlice";

const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!file) return;

    const handleFileUpload = async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axiosInstance.put("/users/profile-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res)
        if(!res.data.success){
          throw new Error("Upload failed");
        }
        dispatch(signInSuccess({ ...currentUser, avatar: res.data.avatar }));
        console.log("✅ Upload success:", res.data);
      } catch (error) {
        console.error("❌ Upload failed:", error);
      }
    };

    handleFileUpload();
  }, [file]);

  return (
    <div className="p-3 max-w-xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          alt={currentUser.name}
          className="rounded-full w-24 h-24 self-center object-cover cursor-pointer"
        />
        <input
          type="text"
          placeholder="username"
          id="username"
          className="bg-slate-50 p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          className="bg-slate-50 p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="bg-slate-50 p-3 rounded-lg"
        />
        <button className="bg-blue-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-3">
        <span className="text-red-700 cursor-pointer font-semibold">
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer font-semibold">
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default Profile;
