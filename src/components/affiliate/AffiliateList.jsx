// pages/AdvertisersList.jsx
import { useEffect, useState } from "react";
import { Button, Popconfirm, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// const baseurl = "http://localhost:5000"; // Change if needed
import { baseurl } from "../../helper/Helper";

export default function AffiliateList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch advertisers from backend
  const fetchAdvertisers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseurl}/api/affiliates/getAllAffiliate`);
      console.log("data---", res.data);
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load advertisers.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvertisers();
  }, []);

   const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/affiliates/deleteAffiliate/${id}`);
      message.success("Affiliate deleted.");
      fetchAdvertisers();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete affiliate.");
    }
  };

  // Ant Design table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "affiliateName",
      render: (text, record) => (
        <a
          onClick={() => navigate(`/affiliates/${record._id}/general`)}
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
      title: "Manager",
      dataIndex: ["manager", "name"],
      render: (_, record) => record.manager?.name || "N/A",
    },

     {
      title: "Delete",
      render: (_, record) => (
        <Popconfirm
          title="Delete this affiliate?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger type="link">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }} className="bg-gradient-to-b from-[#e8f1ff] via-[#f4f8ff] to-[#ffffff]">
         <div className="flex items-center justify-between mb-6">
      {/* Left - Title */}
      <h2 className="text-2xl font-bold text-gray-800">
        Affiliate
      </h2>

      {/* Right - Create Button */}
      <button
        onClick={() => navigate("/affiliates/create")}
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
      >
        + Create
      </button>
    </div>

      
  <Table
  className="custom-table"
  columns={columns}
  dataSource={data}
  rowKey="_id"
  loading={loading}
  bordered
/>


    </div>
  );
}
