

import CampaignReport from '../campaignsreport/campaignsreport'
import StatisticsDashboard from '../Staticstics/StatisticsDashboard'
import BalanceCard from '../Dashboard1/BalanceCard'
import DashboardStats from "../Dashboard1/DashboardStats.jsx";

const StatisticsPage = ({id}) => {
  return (
    <div className="mt-8 ">
      {/* <h1
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-4
        text-gray-900 dark:text-gray-100 tracking-tight leading-tight"
      >
        Statistics Dashboard
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-sm md:text-base">
        Analyze your campaign performance, revenue, and key metrics with
        clarity.
      </p> */}
      <BalanceCard id={id}/>
      <DashboardStats id={id}/>
      <CampaignReport id={id} />

      <StatisticsDashboard />
    </div>
  );
};

export default StatisticsPage;
