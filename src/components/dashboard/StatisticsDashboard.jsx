"use client";
import React, { useEffect, useState } from "react";
import api from "../../helper/baseurl";
import toast, { Toaster } from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import CampaignReport from "./campaignsreport";

const StatisticsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chartView, setChartView] = useState("per_campaign");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCharts, setShowCharts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("today"); // today | last_week | last_month

  // Format a Date as local YYYY-MM-DD (avoids UTC issues with toISOString)
  const formatLocalDate = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Fetch campaigns
  const fetchReport = async () => {
    try {
      setLoading(true);

      const end = new Date(); // today
      const start = new Date(end); // clone

      if (dateFilter === "today") {
        // start = end (already cloned)
      } else if (dateFilter === "last_day") {
        start.setDate(end.getDate() - 1);
      } else if (dateFilter === "last_month") {
        
      } else if (dateFilter === "last_week") {
        start.setDate(end.getDate() - 7);
      } else if (dateFilter === "last_month") {
        start.setMonth(end.getMonth() - 1);
      }

      const response = await api.get("/reports/campaigns", {
        params: {
          startDate: formatLocalDate(start),
          endDate: formatLocalDate(end),
        },
      });

      if (response.data?.success) {
        setData(response.data.report || []);
        toast.success("Report loaded successfully!");
      } else {
        toast.error(response.data?.message || "Failed to load report!");
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching campaign report:", err);
      toast.error("Error fetching campaign report");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // re-fetch when dateFilter changes
  }, [dateFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading report...
      </div>
    );
  }

  const rows = data.slice(0, -1);
  const totals = data[data.length - 1];

  // Filtered & Paginated Data
  const filteredRows = rows.filter((row) =>
    String(row.Campaign || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;

  // Export CSV
  const exportCSV = () => {
    if (!rows.length) {
      toast.error("No data to export!");
      return;
    }

    const headers = Object.keys(rows[0]).join(",");
    const csvRows = rows.map((row) =>
      Object.values(row)
        .map((v) => `"${v}"`)
        .join(",")
    );
    const csvContent = [headers, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campaign_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("CSV exported successfully!");
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setChartView("per_campaign");
    setRowsPerPage(10);
    setCurrentPage(1);
    setDateFilter("today");
    toast("Filters reset!");
  };

  return (
    <main className="flex-1 mt-8 px-4 md:px-8 lg:px-12 max-w-8xl">
      <Toaster position="top-right" />

      <button
  className="gettouch-btn inline-flex items-center gap-2 rounded-2xl px-5 py-3
         font-semibold tracking-wide text-white
         bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600
         shadow-lg shadow-indigo-500/30
         hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500
         hover:shadow-xl hover:shadow-fuchsia-500/30
         active:scale-[.98]
         focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400
         focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
         transition-all duration-300">
 
  <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 3h18v14H3z"></path>
    <path d="M7 21h10M12 17v4"></path>
    <path d="M7 7h4v6H7zM13 7h4v3h-4z"></path>
  </svg>
  <span>Report Based On Compaign</span>
</button>

      <CampaignReport url={"/reports/campaigns"} />


<button
  class="gettouch-btn inline-flex items-center gap-2 rounded-2xl px-5 py-3
         font-semibold tracking-wide text-white
         bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600
         shadow-lg shadow-indigo-500/30
         hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500
         hover:shadow-xl hover:shadow-fuchsia-500/30
         active:scale-[.98]
         focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400
         focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
         transition-all duration-300">
  
  <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 3h18v14H3z"></path>
    <path d="M7 21h10M12 17v4"></path>
    <path d="M7 7h4v6H7zM13 7h4v3h-4z"></path>
  </svg>
  <span>Report Based On Affiliate</span>
</button>

      <CampaignReport url={"/reports/affiliate"} />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div className="flex gap-2 flex-wrap items-center">
          {/* Date Range Dropdown */}
          <label className="text-sm text-gray-600">Date range:</label>
          <select
            value={dateFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setDateFilter(e.target.value);
            }}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="today">Today</option>
            <option value="last_day">Last Day</option>
            <option value="last_week">Last Week</option>
            <option value="last_month">Last Month</option>
          </select>

          <button
            onClick={() => setShowCharts(!showCharts)}
            className="flex items-center gap-1 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <i className="mdi mdi-chart-line"></i>{" "}
            {showCharts ? "Hide charts" : "Show charts"}
          </button>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <i className="mdi mdi-restart"></i> Reset
          </button>
          <button
            onClick={fetchReport}
            className="flex items-center gap-1 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <i className="mdi mdi-refresh"></i> Refresh
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <i className="mdi mdi-tray-arrow-down"></i> Export CSV
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <i className="mdi mdi-magnify text-gray-400"></i>
          <input
            type="text"
            placeholder="Search in statistics"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={searchQuery}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchQuery(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Chart Section */}
           {/* Chart Section */}
      {showCharts && (() => {
        // Calculate dynamic height
        const maxClicks = Math.max(...rows.map(r => r.Clicks || 0), 0);
        const maxConversions = Math.max(...rows.map(r => r.Conversions || 0), 0);
        const maxValue = Math.max(maxClicks, maxConversions);

        // scale chart height: 2px per unit, min 200px, max 600px
        const chartHeight = Math.min(Math.max(maxValue * 2, 200), 600);

        return (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Campaign Chart
              </h2>
              <select
                className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={chartView}
                onChange={(e) => setChartView(e.target.value)}
              >
                <option value="per_campaign">Per campaign</option>
              </select>
            </div>
            <div style={{ height: chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rows}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="Campaign" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Clicks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="Conversions"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}



    



      {/* Table Section */}
      <div className="overflow-x-auto no-scrollbar bg-white rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Campaign",
                "Clicks",
                "Payout",
                "Payout in INR",
                "Conversions",
                "Conversion Rate (CR)",
                "Sale Amount",
                "Sale Amount in INR",
                "Extended Conversions",
                "Cancelled Conversions",
                "Pending Conversions",
                "Pending Payout",
                "Pending Payout in INR",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex justify-end items-center gap-1">
                    {header}
                    <i className="mdi mdi-swap-vertical text-gray-400 cursor-pointer hover:text-gray-600"></i>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedRows.map((row, index) => (
              <tr
                key={row.Campaign ?? index}
                className={index % 2 === 0 ? "bg-gray-50" : ""}
              >
                {Object.keys(row).map((key) => (
                  <td
                    key={key}
                    className="px-4 py-2 text-right text-sm text-gray-700"
                  >
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {totals && (
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                {Object.keys(totals).map((key) => (
                  <td key={key} className="px-4 py-2 text-right text-sm">
                    {totals[key]}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 gap-2">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            className="border rounded px-2 py-1 text-sm"
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
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Hide scrollbar but keep scrolling */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
};

export default StatisticsDashboard;
