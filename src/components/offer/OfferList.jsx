import { useEffect, useState } from "react";
import { Button, Popconfirm, Table, message, Input, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseurl } from "../../helper/Helper";

export default function OfferList() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Fetch all campaigns
  const fetchCompaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseurl}/api/compaigns/getALLCompaign`);
      setData(res.data.data);
      setFilteredData(res.data.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load campaigns.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompaigns();
  }, []);

  // Delete campaign
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/compaigns/deleteCompaign/${id}`);
      message.success("Campaign deleted.");
      fetchCompaigns();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete campaign.");
    }
  };

  // 🔍 Filtering logic
  useEffect(() => {
    const keyword = search.toLowerCase().trim();

    const filtered = data.filter((item) => {
      const nameMatch = item.offerName?.toLowerCase().includes(keyword);
      const compIdMatch = item.compId?.toString().includes(keyword);
      const advertiserMatch = item.advertiser?.name
        ?.toLowerCase()
        .includes(keyword);

      return nameMatch || compIdMatch || advertiserMatch;
    });

    setFilteredData(filtered);
  }, [search, data]);

  // Table Columns
  const columns = [
    {
      title: "Offer Name",
      dataIndex: "offerName",
      render: (text, record) => (
        <a
          onClick={() => navigate(`/offers/${record._id}/general`)}
          style={{ color: "#1677ff", cursor: "pointer" }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Comp ID",
      dataIndex: "compId",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Advertiser",
      dataIndex: ["advertiser", "name"],
      render: (_, record) => record.advertiser?.name || "N/A",
    },
    // {
    //   title: "Delete",
    //   render: (_, record) => (
    //     <Popconfirm
    //       title="Delete this campaign?"
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
    <div className="p-6 bg-blue-50 rounded-2xl shadow-lg border border-blue-100">

      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Offers</h2>

        <button
          onClick={() => navigate("/offers/crete")}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
        >
          + Create Offer
        </button>
      </div>

      {/* 🔍 Search Bar */}
      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Input
            placeholder="Search by offerName, compId or advertiser..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      {/* Table */}
      <div className="rounded-xl overflow-hidden shadow-lg">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="offer-table custom-table"
        />
      </div>

    </div>
  );
}
