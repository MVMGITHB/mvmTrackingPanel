import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { baseurl } from "../../helper/Helper";


const Sub1Report = () => {

  const { token, user } = useAuth();

  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {

    try {

      setLoading(true);

     
      const res = await axios.get(
        `${baseurl}/api/reports/reportbasedOnsub1`,
        {
          params: {
            startDate,
            endDate,
         
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReport(res.data.report || []);

    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch report on load
  useEffect(() => {
   
      fetchReport();
    
  }, [user]);

  return (
    <div className="p-6 bg-gray-50  flex-1 px-4 md:px-8 lg:px-12 py-6 
    bg-gradient-to-b from-sky-200 via-orange-50 to-white
    rounded-2xl shadow-xl
    animate-fadeUp mt-8 ">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-700">
          Sub1 Performance Report
        </h2>
        <p className="text-gray-500 text-sm">
          View campaign performance by Sub1 tracking.
        </p>
      </div>

      {/* Filter Card */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">

        <div className="flex flex-wrap gap-4 items-end">

          <div>
            <label className="text-sm text-gray-500">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            onClick={fetchReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow"
          >
            Generate Report
          </button>

        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading report...
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">

          <table className="min-w-full text-sm text-gray-600">

            <thead className="bg-gray-100 text-gray-700">

              <tr>
                <th className="p-3 text-left">Campaign</th>
                <th className="p-3 text-left">PubId</th>
                <th className="p-3 text-left">Sub1</th>
                <th className="p-3">Clicks</th>
                <th className="p-3">Unique Clicks</th>
                <th className="p-3">Conversions</th>
                <th className="p-3">CR</th>
                <th className="p-3">Payout</th>
                <th className="p-3">Payout INR</th>
                <th className="p-3">Sale Amount</th>
                <th className="p-3">Sale INR</th>
              </tr>

            </thead>

            <tbody>

              {report.length === 0 && (
                <tr>
                  <td colSpan="11" className="text-center py-6 text-gray-400">
                    No data found
                  </td>
                </tr>
              )}

              {report.map((row, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-3">{row.Campaign}</td>
                  <td className="p-3">{row.pubId}</td>
                  <td className="p-3 font-medium text-blue-600">{row.sub1}</td>
                  <td className="p-3 text-center">{row.Clicks}</td>
                  <td className="p-3 text-center">{row["Unique Clicks"]}</td>
                  <td className="p-3 text-center">{row.Conversions}</td>
                  <td className="p-3 text-center">{row["Conversion Rate (CR)"]}</td>
                  <td className="p-3 text-center">{row.Payout}</td>
                  <td className="p-3 text-center">{row["Payout in INR"]}</td>
                  <td className="p-3 text-center">{row["Sale Amount"]}</td>
                  <td className="p-3 text-center">{row["Sale Amount in INR"]}</td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default Sub1Report;