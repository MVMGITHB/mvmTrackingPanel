import React, { useEffect, useState } from "react";
import api from "../baseurl/baseurl.jsx";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, RefreshCw, BarChart3, Search } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseurl } from "../../helper/Helper.jsx";

// --- Helpers ---
function safeParse(raw) {
  try {
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function extractAffiliateData(stored) {
  if (!stored) return null;
  return stored.pubId || stored.affiliate?.pubId || stored.user?.pubId || null;
}
// ----------------------------------------

const StatisticsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCharts, setShowCharts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("today");

  const [pubId, setPubId] = useState();


   const { id } = useParams();

    useEffect(() => {
    const fetchAffiliate = async () => {
      try {
        const response = await axios.get(
          `${baseurl}/api/affiliates/getOneAffiliate/${id}`
        );

        const data = response.data;
        setPubId(data?.pubId)

      } catch (error) {
        console.error("Error fetching affiliate:", error);
      }
    };

    fetchAffiliate();
  }, [id]);

  const formatLocalDate = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const end = new Date();
      const start = new Date(end);

      if (dateFilter === "last_day") start.setDate(end.getDate() - 1);
      if (dateFilter === "last_week") start.setDate(end.getDate() - 7);
      if (dateFilter === "last_month") start.setMonth(end.getMonth() - 1);

      const response = await api.get("/reports/publicerReport", {
        params: {
          pubId,
          startDate: formatLocalDate(start),
          endDate: formatLocalDate(end),
        },
      });

      if (response.data?.success) {
        setData(response.data.report || []);
      } else {
        toast.error(response.data?.message || "Failed to load report!");
        setData([]);
      }
    } catch (err) {
      toast.error("Error fetching publisher report");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [dateFilter, pubId]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-16 text-lg text-gray-500 font-medium">
        Loading publisher report...
      </div>
    );

  const rows = data.slice(0, -1);
  const totals = data[data.length - 1];
  const filteredRows = rows.filter((row) =>
    String(row.Campaign || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;

  const exportCSV = () => {
    if (!rows.length) return toast.error("No data to export!");
    const headers = Object.keys(rows[0]).join(",");
    const csvRows = rows.map((row) =>
      Object.values(row)
        .map((v) => `"${v}"`)
        .join(",")
    );
    const blob = new Blob([[headers, ...csvRows].join("\n")], {
      type: "text/csv",
    });
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "publisher_report.csv";
    a.click();
    toast.success("CSV exported successfully!");
  };

  return (
 <main className="flex-1 px-4 md:px-8 lg:px-12 py-6 bg-blue-50 rounded-2xl shadow-xl">

  {/* Toolbar */}
  <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-8">

    <div className="flex flex-wrap gap-3 items-center">

      {/* Date Filter */}
      <select
        value={dateFilter}
        onChange={(e) => {
          setCurrentPage(1);
          setDateFilter(e.target.value);
        }}
        className="px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-md text-sm focus:ring-2 focus:ring-blue-400"
      >
        <option value="today">Today</option>
        <option value="last_day">Last Day</option>
        <option value="last_week">Last Week</option>
        <option value="last_month">Last Month</option>
      </select>

      {/* Show Charts */}
      <button
        onClick={() => setShowCharts(!showCharts)}
        className="px-3 py-2 flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 text-sm transition"
      >
        <BarChart3 size={16} />
        {showCharts ? "Hide Charts" : "Show Charts"}
      </button>

      {/* Refresh */}
      <button
        onClick={fetchReport}
        className="px-3 py-2 flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 text-sm transition"
      >
        <RefreshCw size={16} /> Refresh
      </button>

      {/* Export CSV */}
      <button
        onClick={exportCSV}
        className="px-3 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 text-sm transition"
      >
        <Download size={16} /> CSV
      </button>

    </div>

    {/* Search */}
    <div className="flex items-center gap-2 flex-1 md:flex-none mt-2 md:mt-0">
      <div className="relative w-full md:w-64">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search campaigns..."
          className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 shadow-md focus:ring-2 focus:ring-blue-400 text-sm"
          value={searchQuery}
          onChange={(e) => {
            setCurrentPage(1);
            setSearchQuery(e.target.value);
          }}
        />
      </div>
    </div>
  </div>

  {/* Chart Card */}
  {showCharts && rows.length > 0 && (
    <div className=" bg-blue-100 rounded-2xl shadow-lg p-6 mb-10 border border-blue-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Campaign Performance
        </h2>
      </div>

      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows}>
            <XAxis dataKey="Campaign" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="Clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )}

  {/* Table Card */}
  <div className="bg-blue-100 rounded-2xl shadow-lg border border-blue-200 p-4 overflow-x-auto">

    <table className="w-full text-sm border-collapse">
      <thead className="bg-blue-200 text-gray-700 text-xs font-semibold uppercase tracking-wide">
        <tr>
          {data.length > 0 &&
            Object.keys(data[0]).map((header) => (
              <th key={header} className="px-4 py-3 whitespace-nowrap text-right">
                {header}
              </th>
            ))}
        </tr>
      </thead>

      <tbody>
        {paginatedRows.map((row, index) => (
          <tr
            key={index}
            className={`transition ${
              index % 2 === 0
                ? "bg-blue-50 hover:bg-blue-100"
                : "bg-blue-100 hover:bg-blue-200"
            }`}
          >
            {Object.keys(row).map((key) => (
              <td
                key={key}
                className="px-4 py-3 text-gray-700 whitespace-nowrap text-right"
              >
                {row[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>

      {totals && (
        <tfoot className="bg-blue-200 font-semibold text-gray-800">
          <tr>
            {Object.keys(totals).map((key) => (
              <td key={key} className="px-4 py-3 whitespace-nowrap text-right">
                {totals[key]}
              </td>
            ))}
          </tr>
        </tfoot>
      )}
    </table>

  </div>

  {/* Pagination */}
  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 text-sm">
    <div className="flex items-center gap-2">
      <span>Show</span>
      <select
        className="border rounded px-2 py-1 shadow-sm"
        value={rowsPerPage}
        onChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
      <span>of {filteredRows.length} entries</span>
    </div>

    <div className="flex items-center gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
        className="px-3 py-1 border rounded shadow-sm disabled:opacity-40"
      >
        Prev
      </button>

      <span>Page {currentPage} of {totalPages}</span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className="px-3 py-1 border rounded shadow-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  </div>

</main>


  );
};

export default StatisticsDashboard;
