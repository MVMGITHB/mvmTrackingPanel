import React from 'react'
import CampaignReport from '../components/dashboard/campaignsreport'
import StatisticsDashboard from '../components/dashboard/StatisticsDashboard'
import DashboardStats from '../components/Dashboard1/DashboardStats1'
import BalanceCard from '../components/Dashboard1/BalanceCard1'
 const Dashboard1 = () => {
  return (
    <div>
         {/* <CampaignReport/> */}
         <BalanceCard/>
         <DashboardStats/>
         <StatisticsDashboard/>
    </div>
  )
}

export default  Dashboard1
