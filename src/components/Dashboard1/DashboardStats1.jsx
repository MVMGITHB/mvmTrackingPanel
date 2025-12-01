import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// import { baseurl } from "";
import { baseurl } from "../../helper/Helper";
import { useParams } from "react-router-dom";

const DashboardStats = () => {
  const { id } = useParams();

  const [dailyStats, setDailyStats] = useState({
    clicks: 0,
    hosts: 0,
    conversions: 0,
    secondConversions: 0,
    revenue: 0,
    secondRevenue: 0,
    totalConversions: 0, // conversions + secondConversions
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // ENDPOINTS (unchanged)
        const [dailyRes, last10Res] = await Promise.all([
          axios.get(`${baseurl}/api/reports/daily`),
          axios.get(`${baseurl}/api/reports/last10days`),
        ]);

        // DAILY STATS
        const d = dailyRes.data || {};
        const clicks = Number(d.clicks) || 0;
        const hosts = Number(d.hosts) || 0;
        const conversions = Number(d.conversions) || 0;
        const secondConversions = Number(d.secondConversions) || 0;
        const revenue = Number(d.revenue) || 0;
        const secondRevenue = Number(d.secondRevenue) || 0;

        const totalConversions = conversions + secondConversions;

        setDailyStats({
          clicks,
          hosts,
          conversions,
          secondConversions,
          revenue,
          secondRevenue,
          totalConversions,
        });

        // LAST 10 DAYS CHART DATA ---------------------------
        const cleanData = (last10Res.data || []).map((item) => ({
          ...item,
          clicks: Number(item.clicks) || 0,
          conversions: Number(item.conversions) || 0,
          secondConversions: Number(item.secondConversions) || 0,
          revenue: Number(item.revenue) || 0,
          secondRevenue: Number(item.secondRevenue) || 0,

          // NEW: combined conversions for graph
          totalConversions:
            (Number(item.conversions) || 0) +
            (Number(item.secondConversions) || 0),
        }));

        setChartData(cleanData);

        console.log("📊 Daily Stats:", dailyRes.data);
        console.log("📈 Chart Data:", cleanData);
      } catch (error) {
        console.error("❌ Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // keep unchanged

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-600">
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-blue-50">
      {/* 🟢 Daily Statistics Section */}
      <h2 className="text-gray-800 text-lg font-semibold mb-2">
        Daily Statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-blue-50">
        {[
          { title: "Clicks", value: dailyStats.clicks },
          { title: "Hosts", value: dailyStats.hosts },
          // SHOW totalConversions in card
          { title: "Conversions", value: dailyStats.totalConversions },
        ].map((item, i) => (
          <div
            key={i}
            className={`rounded-xl border ${
              item.title === "Conversions"
                ? "border-green-400"
                : "border-gray-200"
            } p-6 bg-blue-50 shadow-sm hover:shadow-md transition`}
          >
            <p className="text-gray-600 font-medium">{item.title}</p>
            <h3 className="text-3xl font-semibold text-gray-800 mt-2">
              {item.value || 0}
            </h3>
            <p
              className={`text-xs mt-2 ${
                item.title === "Conversions" ? "text-red-500" : "text-green-500"
              }`}
            >
              {item.value > 0 ? "↑" : "—"}
            </p>
          </div>
        ))}
      </div>

      {/* 📊 Chart Section */}
      <div className="shadow-md rounded-xl p-6 bg-blue-50">
        <h3 className="text-gray-800 font-semibold mb-4 uppercase">
          Statistics for the last 10 days
        </h3>

        {chartData.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No data available for the last 10 days.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />

              {/* dual axis */}
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />

              <Tooltip />
              <Legend />

              {/* 🟣 Clicks */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="clicks"
                stroke="#a855f7"
                name="Clicks"
                strokeWidth={2}
                dot={{ r: 3 }}
              />

              {/* 🟢 Unique Conversions */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="conversions"
                stroke="#22c55e"
                name="Unique Conversions"
                strokeWidth={2}
                dot={{ r: 3 }}
              />

              {/* 🔵 Total Conversions (unique + non-unique) */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalConversions"
                stroke="#3b82f6"
                name="Total Conversions (All)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />

              {/* 🟡 Revenue */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#eab308"
                name="Revenue (INR)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />

              {/* 🟣 Second Revenue */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="secondRevenue"
                stroke="#6366f1"
                name="Second Revenue (INR)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;
