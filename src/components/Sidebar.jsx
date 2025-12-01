import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaBullhorn, FaUsers, FaGift } from "react-icons/fa";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "Advertisers", path: "/advertisers", icon: <FaBullhorn /> },
  { name: "Affiliates", path: "/affiliates", icon: <FaUsers /> },
  { name: "Offers", path: "/offers", icon: <FaGift /> },
  { name: "click", path: "/click", icon: <FaGift /> },
];

const Sidebar = () => {
  return (
    <div
      className="
        w-64 h-[100vh] sticky
        bg-sky-200 
        text-white shadow-xl p-4 
        transition-all duration-300
      "
    >
      {/* Logo / Title */}
      {/* <h1 className="text-2xl font-extrabold mb-10 text-center tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-300">
        Tracking Panel
      </h1> */}

      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <img
          src="https://mvmbs.com/images/logo.webp"
          alt="logo"
          className="
            w-[55px] h-[55px]
           "
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

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-300 relative
                
                ${
                  isActive
                    ? "bg-sky-700 text-black shadow-inner"
                    : "text-black hover:text-black hover:bg-white/10"
                }
              `
            }
          >
            {/* Icon with animation */}
            <span
              className="
                text-lg
                transition-transform duration-300 
                group-hover:scale-110
              "
            >
              {item.icon}
            </span>

            <span className="transition-all duration-300">{item.name}</span>

            {/* Active Glow Bar (Left side) */}
            {({ isActive }) =>
              isActive ? (
                <span className="absolute left-0 top-0 h-full w-[4px] bg-blue-400 rounded-r-lg shadow-md"></span>
              ) : null
            }
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
