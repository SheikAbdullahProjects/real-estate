import React from "react";
import {Link} from "react-router-dom"
import {Search} from "lucide-react"
import { useSelector } from "react-redux";


const Header = () => {
  const {currentUser} = useSelector((state) => state.user)
  return (
    <header className=" bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"}>
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500">Sheik</span> 
          <span className="text-slate-700">Estate</span>
        </h1>
        </Link>
        <form className="bg-slate-100 p-2 rounded-lg flex items-center">
          <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64" />
          <Search className="text-slate-600" />
        </form>
        <ul className="flex gap-4 justify-center items-center">
            <Link to={"/home"} className="text-slate-700 hover:underline hidden sm:inline">Home</Link>
            <Link to={"/about"} className="text-slate-700 hover:underline hidden sm:inline">About</Link>
            <Link to={"/profile"} className="text-slate-700 hover:underline">
              {currentUser ? <img src={currentUser.avatar} alt={currentUser.avatar} className="rounded-full w-7 h-7 border" /> : <li className="text-slate-700 hover:underline">Sign In</li> }
            </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
