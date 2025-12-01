import { useEffect, useState } from "react";
import { Button, Popconfirm, Table, message, Input, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseurl } from "../../../helper/Helper";


export default function AffiliateClickList() {

  const { id } = useParams();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campaignSearch, setCampaignSearch] = useState("");
  const [publisherSearch, setPublisherSearch] = useState("");

  const navigate = useNavigate();

  // Fetch latest 20 clicks
  const fetchClicks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseurl}/api/clicks/getClickPubId/${id}`);
      setData(res.data.data);
      console.log(res.data.data)
      setFilteredData(res.data.data); // initial display
    } catch (err) {
      console.error(err);
      message.error("Failed to load clicks.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClicks();
  }, []);

  // Apply search filters
  useEffect(() => {
    let filtered = data;

    if (campaignSearch.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.campaignId.toString().includes(campaignSearch)
      );
    }

    if (publisherSearch.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.pubId.toString().includes(publisherSearch)
      );
    }

    setFilteredData(filtered);
  }, [campaignSearch, publisherSearch, data]);

  // Delete click
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/clicks/delete/${id}`);
      message.success("Click deleted.");
      fetchClicks();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete click.");
    }
  };

  // Ant Design table columns
  const columns = [
    {
      title: "Campaign ID",
      dataIndex: "campaignId",
      width: 120,
    },
    {
      title: "Publisher ID",
      dataIndex: "pubId",
      width: 120,
    },
   {
  title: "Click ID",
  dataIndex: "clickId",
  render: (text, record) => (
    <a
      onClick={() => navigate(`/affiliates/${id}/affiliateClick/${record._id}`)}
      style={{ color: "#1677ff", cursor: "pointer" }}
    >
      {text}
    </a>
  ),
},

    {
      title: "IP",
      dataIndex: "ip",
      width: 150,
    },
    {
      title: "Unique?",
      dataIndex: "isUnique",
      render: (value) =>
        value ? (
          <span style={{ color: "green", fontWeight: "600" }}>Yes</span>
        ) : (
          <span style={{ color: "red", fontWeight: "600" }}>No</span>
        ),
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      render: (value) => new Date(value).toLocaleString(),
      width: 180,
    },
    {
      title: "Delete",
      render: (_, record) => (
        <Popconfirm
          title="Delete this click?"
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
    <div
      style={{ padding: "20px" }}
      className="bg-gradient-to-b from-[#e8f1ff] via-[#f4f8ff] to-[#ffffff]"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Clicks</h2>

      {/* 🔍 Search Filters */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={6}>
          <Input
            placeholder="Search Campaign ID"
            value={campaignSearch}
            onChange={(e) => setCampaignSearch(e.target.value)}
          />
        </Col>

        <Col span={6}>
          <Input
            placeholder="Search Publisher ID"
            value={publisherSearch}
            onChange={(e) => setPublisherSearch(e.target.value)}
          />
        </Col>

        <Col span={4}>
          <Button
            onClick={() => {
              setCampaignSearch("");
              setPublisherSearch("");
            }}
          >
            Reset Filters
          </Button>
        </Col>
      </Row>

      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        loading={loading}
        bordered
        pagination={false}
      />
    </div>
  );
}
