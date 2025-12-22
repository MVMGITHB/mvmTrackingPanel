// pages/AdvertisersList.jsx
import { useEffect, useState } from "react";
import { Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";



// const baseurl = "http://localhost:5000"; // Change if needed
import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";

export default function AdvertisersList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   
  const [auth, setAuth] = useAuth();

  console.log(`Bearer ${auth?.token}`)
  // Fetch advertisers from backend
 const fetchAdvertisers = async () => {
  if (!auth?.token) {
    console.warn("No auth token found");
    return;
  }

  setLoading(true);
  try {
    const res = await axios.get(
      `${baseurl}/api/advertisers/getAll`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    setData(res.data?.data || []);
  } catch (err) {
    console.error("API ERROR:", err.response?.data || err.message);
    message.error("Unauthorized or session expired.");
  } finally {
    setLoading(false);
  }
};



 useEffect(() => {
  if (auth?.token) {
    fetchAdvertisers();
  }
}, [auth?.token]);

  // Ant Design table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <a
          onClick={() => navigate(`/advertisers/${record._id}/general`)}
          style={{ color: "#1677ff", cursor: "pointer" }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },

    {
      title: "Advertise Id",
      dataIndex: "AdId",
    },

    {
      title: "Manager",
      dataIndex: ["manager", "name"],
      render: (_, record) => record.manager?.name || "N/A",
    },
  ];

  return (
    <div style={{ padding: "20px", background: "#fff" }}>
         <div className="flex items-center justify-between mb-6">
      {/* Left - Title */}
      <h2 className="text-2xl font-bold text-gray-800">
        Advertiser
      </h2>

      {/* Right - Create Button */}
      <button
        onClick={() => navigate("/advertisers/new")}
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
      >
        + Create
      </button>
    </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        bordered
      />
    </div>
  );
}
