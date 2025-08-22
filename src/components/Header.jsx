import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center  sticky top-0  z-999">
      <div className="text-xl font-bold text-gray-800">
        {/* Replace with your logo */}
        <span className="cursor-pointer" onClick={() => navigate("/")}>
          MyAppLogo
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
