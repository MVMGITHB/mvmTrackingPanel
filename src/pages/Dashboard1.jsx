import React from 'react'
import CampaignReport from '../components/dashboard/campaignsreport'
import StatisticsDashboard from '../components/dashboard/StatisticsDashboard'
import DashboardStats from '../components/Dashboard1/DashboardStats1'
import BalanceCard from '../components/Dashboard1/BalanceCard1'
import Sub1Report from '../components/Dashboard1/Sub1Report'
 const Dashboard1 = () => {
  return (
    <div>
         {/* <CampaignReport/> */}
         <BalanceCard/>
         <DashboardStats/>
         <StatisticsDashboard/>
         <Sub1Report/>
    </div>
  )
}

export default  Dashboard1
