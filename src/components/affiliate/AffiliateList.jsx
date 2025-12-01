import { useEffect, useState } from "react";
import { Button, Popconfirm, Table, message, Input, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseurl } from "../../helper/Helper";

export default function AffiliateList() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Fetch affiliates
  const fetchAffiliates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseurl}/api/affiliates/getAllAffiliate`);
      setData(res.data);
      setFilteredData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load affiliates.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  // Filtering logic
  useEffect(() => {
    const keyword = search.toLowerCase().trim();

    const filtered = data.filter((item) => {
      const nameMatch = item.affiliateName?.toLowerCase().includes(keyword);
      const firstNameMatch = item.firstname?.toLowerCase().includes(keyword);
      const pubIdMatch = item.pubId?.toString().includes(keyword);

      return nameMatch || firstNameMatch || pubIdMatch;
    });

    setFilteredData(filtered);
  }, [search, data]);

  // Delete affiliate
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/affiliates/deleteAffiliate/${id}`);
      message.success("Affiliate deleted.");
      fetchAffiliates();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete affiliate.");
    }
  };

  // Table columns
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
      title: "Publisher ID",
      dataIndex: "pubId",
    },
    {
      title: "First Name",
      dataIndex: "firstname",
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
    // {
    //   title: "Delete",
    //   render: (_, record) => (
    //     <Popconfirm
    //       title="Delete this affiliate?"
    //       onConfirm={() => handleDelete(record._id)}
    //       okText="Yes"
    //       cancelText="No"
    //     >
    //       <Button danger type="link">
    //         Delete
    //       </Button>
    //     </Popconfirm>
    //   ),
    // },
  ];

  return (
    <div
      style={{ padding: "20px" }}
      className="bg-gradient-to-b from-[#e8f1ff] via-[#f4f8ff] to-[#ffffff]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Affiliates</h2>

        <button
          onClick={() => navigate("/affiliates/create")}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
        >
          + Create
        </button>
      </div>

      {/* 🔍 Search Bar */}
      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Input
            placeholder="Search by name, first name, or pubId..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      {/* Table */}
      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        loading={loading}
        bordered
      />
    </div>
  );
}
