// pages/AffiliateLayout.jsx
import { NavLink, Outlet, useParams } from "react-router-dom";

export default function ClickLayout() {
  const { id } = useParams();

  const tabs = [
    { name: "General", path: "detail" },
    // { name: "Dashboard", path: "account-balance" },
    // { name: "My Offers", path: "contacts" },
    // { name: "Conversion", path: "affiliates" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">

      {/* Gradient Tab Bar */}
      <div
        className="
          bg-gradient-to-r from-blue-50 to-blue-100
          border border-blue-200
          shadow-md rounded-xl px-4 py-3 mb-6
        "
      >
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/click/${id}/${tab.path}`}
              className={({ isActive }) =>
                `
                relative pb-3 font-semibold text-[16px]
                transition-all duration-300
                ${
                  isActive
                    ? "text-blue-700"
                    : "text-gray-700 hover:text-blue-700"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {tab.name}

                  {/* Active underline */}
                  {isActive && (
                    <span
                      className="
                        absolute left-0 right-0 -bottom-[2px]
                        h-[3px] bg-blue-600 rounded-full
                        shadow-md
                        animate-pulse
                      "
                    ></span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Page Content */}
      <div className="mt-2">
        <Outlet />
      </div>
    </div>
  );
}
