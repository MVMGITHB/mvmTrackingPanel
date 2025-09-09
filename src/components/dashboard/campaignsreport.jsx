"use client";
import React, { useState ,useEffect} from "react";
import api from "../../helper/baseurl";
import toast from "react-hot-toast";

export default function CampaignReport({url}) {
  const today = new Date();

  // ✅ Correct formatter for <input type="date">
  const formatDateForInput = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`; // <-- works with <input type="date">
  };

  const formattedToday = formatDateForInput(today);

  const [startDate, setStartDate] = useState(formattedToday);
  const [endDate, setEndDate] = useState(formattedToday);

  const [report, setReport] = useState([]);

  // ✅ Fetch Report with toast.promise
  const fetchReport = async () => {
    await toast.promise(
      // api.get("/reports/campaigns", { params: { startDate, endDate } }),
      api.get(url, { params: { startDate, endDate } }),
      {
        loading: "Fetching report...",
        success: (res) => {
          if (res.data.success) {
            setReport(res.data.report);
            return "Report fetched successfully!";
          } else {
            throw new Error(res.data.message || "Failed to fetch report");
          }
        },
        error: "Server error fetching report",
      }
    );
  };


  useEffect(() => {
    fetchReport();
  }, []);

  // ✅ Export CSV with toast.promise
  const exportCSV = async () => {
    if (report.length === 0) {
      toast.error("No report data to export!");
      return;
    }

    await toast.promise(
      new Promise((resolve) => {
        const headers = Object.keys(report[0]);
        const csvRows = [
          headers.join(","), // header row
          ...report.map((row) =>
            headers.map((field) => `"${row[field] ?? ""}"`).join(",")
          ),
        ];
        const csvData = csvRows.join("\n");
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `campaign_report_${startDate}_to_${endDate}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        setTimeout(resolve, 500); // simulate delay
      }),
      {
        loading: "Exporting CSV...",
        success: "CSV exported successfully!",
        error: "Failed to export CSV",
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6 ">
      {/* Date Picker & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div className="flex gap-2 flex-wrap items-center">
          <div className="flex gap-2">
  <input
    type="date"
    value={startDate}
    onChange={(e) => {
      setStartDate(e.target.value);
      fetchReport(); // run on change
    }}
    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
  />
  <input
    type="date"
    value={endDate}
    onChange={(e) => {
      setEndDate(e.target.value);
      fetchReport(); // run on change
    }}
    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
  />
</div>


          <button
            onClick={fetchReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <i className="fa fa-download"></i> Fetch Report
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <i className="fa fa-file-csv"></i> Export CSV
          </button>
        </div>
      </div>

      {/* Report Table */}
      {report.length > 0 ? (
        <div className=" overflow-x-auto" id="hide-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(report[0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {report.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                  {Object.values(row).map((val, j) => (
                    <td
                      key={j}
                      className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No report data available.</p>
      )}


    </div>
  );
}
