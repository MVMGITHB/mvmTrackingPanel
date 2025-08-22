import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBullhorn, FaUsers, FaGift } from 'react-icons/fa';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
  { name: 'Advertisers', path: '/advertisers', icon: <FaBullhorn /> },
  { name: 'Affiliates', path: '/affiliates', icon: <FaUsers /> },
  { name: 'Offers', path: '/offers', icon: <FaGift /> },
  // { name: 'Clicks', path: '/clicks', icon: <FaMousePointer /> },
  // { name: 'Conversions', path: '/conversions', icon: <FaChartLine /> },
  // { name: 'Settings', path: '/settings', icon: <FaCog /> },
];

const Sidebar = () => {
  return (
    <div className="w-64 h-[85vh] bg-white p-4 shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)] sticky top-20">
      <h1 className="text-xl font-bold mb-6 text-center text-blue-600">
        Tracking Panel
      </h1>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-100 font-medium ${
                isActive ? 'bg-blue-200 text-blue-800' : 'text-gray-700'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
