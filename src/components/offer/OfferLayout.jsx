// pages/AdvertiserLayout.jsx
import { Outlet, NavLink, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function OfferLayout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tabs = [
    { name: "General", path: "general" },
    { name: "Account Balance", path: "account-balance" },
    { name: "Contacts", path: "contacts" },
    { name: "Affiliates", path: "affiliates" },
    { name: "Postback URL", path: "postback-url" },
  ];

  return (
    <div>



      
      <nav style={{ display: "flex", gap: "1rem" }}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={`/offers/${id}/${tab.path}`}
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal",
              borderBottom: isActive ? "2px solid blue" : "none",
            })}
          >
            {tab.name}
          </NavLink>
        ))}
      </nav>

      <hr />
      <Outlet />
    </div>
  );
}
