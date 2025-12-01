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
        bg-sky-100 
        backdrop-blur-xl
        px-6 py-3 
        w-full
        flex flex-row-reverse items-center justify-between
      "
    >
      {/* Logo */}
      

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
