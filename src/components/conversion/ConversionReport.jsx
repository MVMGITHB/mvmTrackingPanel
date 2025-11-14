import React, { useEffect, useState } from "react";
import { DatePicker, Button, Table, Space, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { baseurl } from "../../helper/Helper";
import { useLocation, useParams } from "react-router-dom";

const { RangePicker } = DatePicker;

const ConversionReport = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().add(1, "day").format("YYYY-MM-DD"), // ✅ today → tomorrow
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalConversions, setTotalConversions] = useState(0);
  const[pubId,SetpubId] = useState()

  // ✅ Get pubId from localStorage

  const location = useLocation();
  
    const tab = location.pathname.split("/").pop(); // 👈 last part of URL
  

  const { id } = useParams();
  
      useEffect(() => {
      const fetchAffiliate = async () => {
        try {
          const response = await axios.get(
            `${baseurl}/api/affiliates/getOneAffiliate/${id}`
          );
  
          const data = response.data;
          SetpubId(data?.pubId);
        
  
        } catch (error) {
          console.error("Error fetching affiliate:", error);
        }
      };
  
      fetchAffiliate();
    }, [id,tab]);



  // ✅ Fetch Report Data
  const fetchReport = async (startDate = filters.startDate, endDate = filters.endDate) => {
    if (!pubId) {
      message.error("No affiliate information found.");
      return;
    }

    setLoading(true);
    try {
      const params = { pubId, startDate, endDate };

      const response = await axios.get(`${baseurl}/api/reports/conversions`, {
        params,
      });

      if (response.data.success) {
        setReportData(response.data.data);
        setTotalRevenue(response.data.totalRevenue);
        setTotalConversions(response.data.totalConversions);
      } else {
        message.error("Failed to load report data");
      }
    } catch (error) {
      console.error(error);
      message.error("Error loading report data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-fetch data on component mount (today → tomorrow)
  useEffect(() => {
    fetchReport(filters.startDate, filters.endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Auto-fetch when user selects new dates
  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      fetchReport(filters.startDate, filters.endDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.startDate, filters.endDate]);

  // ✅ Handle reset (back to today → tomorrow)
  const handleResetToToday = () => {
    const today = dayjs().format("YYYY-MM-DD");
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
    setFilters({ startDate: today, endDate: tomorrow });
  };

  // ✅ Export to CSV
  const handleExport = () => {
    if (reportData.length === 0) {
      message.warning("No data to export");
      return;
    }

    const csvRows = [];
    const headers = [
      "Date",
      "Campaign ID",
      "Pub ID",
      "Click ID",
      "Original Click",
      "Amount",
      "Sub1",
      "Sub2",
      "Sub3",
      "Sub4",
      "Sub5",
      "Sub6",
    ];
    csvRows.push(headers.join(","));

    reportData.forEach((item) => {
      const row = [
        dayjs(item.timestamp).format("YYYY-MM-DD HH:mm:ss"),
        item.campaignId,
        item.pubId,
        item.clickId,
        item.originalClick || "",
        item.amount,
        item.sub1 || "",
        item.sub2 || "",
        item.sub3 || "",
        item.sub4 || "",
        item.sub5 || "",
        item.sub6 || "",
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `conversion_report_${Date.now()}.csv`;
    link.click();
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "timestamp",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
      fixed: "left",
      width: 160,
    },
    { title: "Campaign ID", dataIndex: "campaignId", width: 120 },
    { title: "Pub ID", dataIndex: "pubId", width: 100 },
    { title: "Click ID", dataIndex: "clickId", width: 160 },
    {
      title: "Original Click",
      dataIndex: "originalClick",
      render: (text) =>
        text ? (
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        ) : (
          "-"
        ),
      width: 200,
    },
    { title: "Amount", dataIndex: "amount", width: 100 },
    { title: "Sub1", dataIndex: "sub1", width: 120 },
    { title: "Sub2", dataIndex: "sub2", width: 120 },
    { title: "Sub3", dataIndex: "sub3", width: 120 },
    { title: "Sub4", dataIndex: "sub4", width: 120 },
    { title: "Sub5", dataIndex: "sub5", width: 120 },
    { title: "Sub6", dataIndex: "sub6", width: 120 },
  ];

  return (
   <div className="p-6 bg-blue-50 rounded-2xl shadow-lg border border-blue-100">

  {/* Header */}
  <h2 className="text-xl font-bold mb-6 text-gray-700">Conversion Report</h2>

  {/* Filters */}
  <div className="flex flex-wrap gap-3 mb-6 items-center">

    <RangePicker
      format="YYYY-MM-DD"
      value={[dayjs(filters.startDate), dayjs(filters.endDate)]}
      onChange={(dates) => {
        if (dates) {
          setFilters({
            startDate: dates[0].format("YYYY-MM-DD"),
            endDate: dates[1].format("YYYY-MM-DD"),
          });
        }
      }}
      className="shadow-md border border-blue-200 rounded-lg"
    />

    <Button
      type="default"
      onClick={handleResetToToday}
      className="shadow-md border border-blue-200 hover:border-blue-400"
    >
      Reset to Today + Next Day
    </Button>

    <Button
      type="default"
      onClick={handleExport}
      className="shadow-md border border-blue-200 hover:border-blue-400"
    >
      Export
    </Button>

  </div>

  {/* Summary */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div className="bg-white shadow-md border border-blue-100 rounded-xl p-4">
      <div className="text-gray-500 text-sm">Total Conversions</div>
      <div className="text-2xl font-bold text-gray-700">{totalConversions}</div>
    </div>

    <div className="bg-white shadow-md border border-blue-100 rounded-xl p-4">
      <div className="text-gray-500 text-sm">Total Revenue</div>
      <div className="text-2xl font-bold text-green-600">
        ${totalRevenue.toFixed(2)}
      </div>
    </div>
  </div>

  {/* Table Container */}
  <div className="rounded-xl overflow-hidden shadow-lg">

    <Table
      columns={columns}
      dataSource={reportData}
      loading={loading}
      rowKey={(record) => record.clickId}
      pagination={{ pageSize: 10 }}
      scroll={{ x: "max-content" }}
      className="custom-conversion-table"
    />

  </div>
</div>

  );
};

export default ConversionReport;
