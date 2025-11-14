// // pages/AdvertiserLayout.jsx
// import { Outlet, NavLink, useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// export default function OfferLayout() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const tabs = [
//     { name: "General", path: "general" },
//     { name: "Affiliates", path: "affiliates" },
//     // { name: "Account Balance", path: "account-balance" },
//     // { name: "Contacts", path: "contacts" },
    
//     // { name: "Postback URL", path: "postback-url" },
//   ];

//   return (
//     <div>



      
//       <nav style={{ display: "flex", gap: "1rem" }}>
//         {tabs.map((tab) => (
//           <NavLink
//             key={tab.path}
//             to={`/offers/${id}/${tab.path}`}
//             style={({ isActive }) => ({
//               fontWeight: isActive ? "bold" : "normal",
//               borderBottom: isActive ? "2px solid blue" : "none",
//             })}
//           >
//             {tab.name}
//           </NavLink>
//         ))}
//       </nav>

//       <hr />
//       <Outlet />
//     </div>
//   );
// }


// pages/AffiliateLayout.jsx
import { NavLink, Outlet, useParams } from "react-router-dom";

export default function OfferLayout() {
  const { id } = useParams();

  const tabs = [
      { name: "General", path: "general" },
   { name: "Affiliates", path: "affiliates" },
    
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
               to={`/offers/${id}/${tab.path}`}
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
