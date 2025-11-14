import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header
      className="
        sticky top-0 z-[999] 
        bg-gradient-to-r from-[#0f172a] to-[#1e293b]
        shadow-xl border-b border-white/10
        backdrop-blur-xl
        px-6 py-3 
        flex items-center justify-between
      "
    >
      {/* Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <img
          src="https://mvmbs.com/images/logo.webp"
          alt="logo"
          className="
            w-[55px] h-[55px] rounded-full
            transition-transform duration-300 group-hover:scale-110
            shadow-lg"
        />

        {/* <h1
          className="
            text-2xl font-extrabold 
            bg-gradient-to-r from-blue-300 to-sky-400
            bg-clip-text text-transparent
            tracking-wide
          "
        >
          Tracking Panel
        </h1> */}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="
          flex items-center gap-2 
          bg-red-500/80 hover:bg-red-600 
          text-white font-medium
          px-5 py-2 rounded-xl
          transition-all duration-300
          shadow-md hover:shadow-red-300/40
          hover:scale-105 active:scale-95
        "
      >
        <FaPowerOff />
        Logout
      </button>
    </header>
  );
};

export default Header;
