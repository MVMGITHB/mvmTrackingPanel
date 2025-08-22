import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const kpis = [
    {
      title: "Total Profit",
      value: "$0.00",
      change: "-100.00%",
      trend: "down",
      yesterday: "$0.05",
      mtd: "$0.05",
      wtd: "$0.05",
    },
    {
      title: "Total Revenue",
      value: "$0.00",
      change: "-100.00%",
      trend: "down",
      yesterday: "$0.10",
      mtd: "$0.10",
      wtd: "$0.10",
    },
    {
      title: "Affiliate Revenue",
      value: "$0.00",
      change: "+100.00%",
      trend: "up",
      yesterday: "$0.05",
      mtd: "$0.05",
      wtd: "$0.05",
    },
    {
      title: "Approved Conversions",
      value: "0",
      change: "-100.00%",
      trend: "down",
      yesterday: "1",
      mtd: "1",
      wtd: "1",
    },
    {
      title: "Clicks",
      value: "14",
      change: "+1300.00%",
      trend: "up",
      yesterday: "1",
      mtd: "15",
      wtd: "15",
    },
    {
      title: "Impressions",
      value: "0",
      change: "0%",
      trend: "same",
      yesterday: "0",
      mtd: "0",
      wtd: "0",
    },
  ];

  const donutData = [{ name: "2 - mukeshtesting", value: 14 }];
  const COLORS = ["#7CF2AE"];

  return (
    <div className=" bg-gray-100 p-6 space-y-6 scrollbar-hide">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.slice(0, 4).map((kpi, i) => (
          <div key={i} className="bg-white shadow p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">{kpi.title}</h3>
              <span
                className={`text-xs font-bold ${
                  kpi.trend === "up"
                    ? "text-green-500"
                    : kpi.trend === "down"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold my-2">{kpi.value}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <div>Yesterday <span className="float-right text-black">{kpi.yesterday}</span></div>
              <div>MTD <span className="float-right text-black">{kpi.mtd}</span></div>
              <div>WTD <span className="float-right text-black">{kpi.wtd}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kpis.slice(4).map((kpi, i) => (
          <div key={i} className="bg-white shadow p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">{kpi.title}</h3>
              <span
                className={`text-xs font-bold ${
                  kpi.trend === "up"
                    ? "text-green-500"
                    : kpi.trend === "down"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {kpi.change}
              </span>
            </div>
            <p className="text-3xl font-bold my-2">{kpi.value}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <div>Yesterday <span className="float-right text-black">{kpi.yesterday}</span></div>
              <div>MTD <span className="float-right text-black">{kpi.mtd}</span></div>
              <div>WTD <span className="float-right text-black">{kpi.wtd}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphs and Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Clicks Affiliates */}
        <div className="bg-white shadow p-4 rounded-xl">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Top clicks affiliates</h3>
            <span className="text-sm text-gray-500">Today</span>
          </div>
          <div className="flex items-center justify-center h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm pl-4 pt-2 text-green-500">
            ● 2 - mukeshtesting
          </div>
        </div>

        {/* Top Conversions Affiliates */}
        <div className="bg-white shadow p-4 rounded-xl">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Top conversions affiliates</h3>
            <span className="text-sm text-gray-500">Today</span>
          </div>
          <div className="text-sm text-green-500 mt-10 pl-4">
            ● 2 - mukeshtesting
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
