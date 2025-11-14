import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaBullhorn, FaUsers, FaGift } from "react-icons/fa";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "Advertisers", path: "/advertisers", icon: <FaBullhorn /> },
  { name: "Affiliates", path: "/affiliates", icon: <FaUsers /> },
  { name: "Offers", path: "/offers", icon: <FaGift /> },
];

const Sidebar = () => {
  return (
    <div
      className="
        w-64 h-[90vh] sticky top-20 
        bg-gradient-to-b from-[#0f172a] to-[#1e293b]
        text-white shadow-xl p-4 
        transition-all duration-300
      "
    >
      {/* Logo / Title */}
      {/* <h1 className="text-2xl font-extrabold mb-10 text-center tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-300">
        Tracking Panel
      </h1> */}

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
                    ? "bg-blue-500/20 text-blue-300 shadow-inner"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
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
