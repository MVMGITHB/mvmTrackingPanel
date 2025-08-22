// AdvertisersLayout.jsx
import { NavLink, Outlet } from "react-router-dom";

export default function AdvertisersLayout() {
  const tabs = [
    { label: "General Information", path: "general" },
    { label: "Account Balance", path: "account" },
    { label: "Contact", path: "contact" },
    { label: "Affiliate", path: "affiliate" },
    { label: "Postback", path: "postback" },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `pb-2 text-sm font-medium ${
                isActive
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Page Content */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
