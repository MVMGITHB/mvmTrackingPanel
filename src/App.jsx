import React,{useState,useEffect} from "react";
import './App.css'

import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Advertiser from './pages/Advertiser';
import Affiliate from './pages/Affiliate';
import Offer from './pages/Offer';
import Header from "./components/Header";
import PublisherPanel from "./components/PublisherPanel ";
import AffiliateList from "./components/affiliate/AffiliateList";
import AffiliateLayout from "./components/affiliate/AffiliateLayout";
import CreateAffiliate from "./components/affiliate/CreateAffiliate";
import AffiliateGenral from "./components/affiliate/AffiliateGenral";


import Dashboard1 from "./pages/Dashboard1";

import OfferLayout from "./components/offer/OfferLayout";
import OfferList from "./components/offer/OfferList";
import CreateOffer from "./components/offer/CreateOffer";
import OfferGenral from "./components/offer/OfferGenral";
// import AdvertisersLayout from "./components/AdvertisersLayout";




import AdvertisersList from "./pages/AdvertisersList";
import AdvertiserLayout from "./pages/AdvertiserLayout";
import New from "./components/New";


import {GeneralTab} from "./components/Tab";
import {AccountTab} from "./components/Tab";
import {ContactTab} from "./components/Tab";
import {AffiliateTab} from "./components/Tab";
import {PostbackTab} from "./components/Tab";
import { AffiliateTab1 } from "./components/offer/AffiliateTab1";
import ClickPage from "./pages/ClickPage";
import ClickLayout from "./components/click/ClickLayout";
import ClickList from "./components/click/ClickList";
import ClickDetails from "./components/click/ClickDetails";
import AffiliateClick from "./components/affiliate/AffiliateClick";
import AffiliateClickDetails from "./components/affiliate/click/ClickDetails";


const ProtectedRoute = ({ children }) => {
  const authData = localStorage.getItem("authToken");
  const token = authData ? authData : null;

  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-600">
          You are not logged in. Redirecting to login in {countdown} second
          {countdown !== 1 ? "s" : ""}...
        </p>
      </div>
    );
  }

  return children;
};


// Layout wrapper for protected routes (Sidebar + Main content)
const ProtectedLayout = () => {
  return (

    <>
    
    <div className="flex  bg-gray-100">
      <Sidebar />
      <div id="hide-scrollbar"
  className="
    flex-1  overflow-y-auto

    bg-gradient-to-b from-[#e8f1ff] via-[#f4f8ff] to-[#ffffff]
    animate-[gradientMove_8s_ease_infinite]

    bg-[length:300%_300%] h-[100vh]
  ">
             
         {/* <PublisherPanel/> */}

         <Header/>

        <Routes>



          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/dashboard" element={<Dashboard1 />} />


          {/* <Route path="/advertisers" element={<Advertiser />} /> */}
          {/* <Route path="/affiliates" element={<Affiliate />} /> */}



          <Route path="/affiliates" element={<AffiliateList />} />
          <Route path="/affiliates/create" element={<CreateAffiliate />} />


          <Route path="/affiliates/:id" element={<AffiliateLayout />}>
          <Route path="general" element={<AffiliateGenral />} />
          <Route path="account-balance" element={<AccountTab />} />
          <Route path="contacts" element={<ContactTab />} />
          <Route path="affiliates" element={<AffiliateTab />} />
          <Route path="postback-url" element={<PostbackTab />} />
          <Route path="affiliateClick" element={<AffiliateClick />} />

           <Route path="affiliateClick/:clickId" element={<AffiliateClickDetails />} />
          
          {/* Redirect to General tab by default */}
          <Route index element={<Navigate to="general" replace />} />
        </Route>






          {/* <Route path="/offers" element={<Offer />} /> */}

        <Route path="/offers" element={<OfferList />} />
        <Route path="/offers/crete" element={<CreateOffer />} />
        {/* Layout with tabs */}
        <Route path="/offers/:id" element={<OfferLayout />}>
          <Route path="general" element={<OfferGenral />} />
          <Route path="account-balance" element={<AccountTab />} />
          <Route path="contacts" element={<ContactTab />} />
          <Route path="affiliates" element={<AffiliateTab1 />} />
          <Route path="postback-url" element={<PostbackTab />} />
         

          
          {/* Redirect to General tab by default */}
          <Route index element={<Navigate to="general" replace />} />
        </Route>
           



          


        <Route path="/advertisers" element={<AdvertisersList />} />
        <Route path="/advertisers/new" element={<New />} />
        {/* Layout with tabs */}
        <Route path="/advertisers/:id" element={<AdvertiserLayout />}>
          <Route path="general" element={<GeneralTab />} />
          <Route path="account-balance" element={<AccountTab />} />
          <Route path="contacts" element={<ContactTab />} />
          <Route path="affiliates" element={<AffiliateTab />} />
          <Route path="postback-url" element={<PostbackTab />} />
          
          {/* Redirect to General tab by default */}
          <Route index element={<Navigate to="general" replace />} />
        </Route>

        {/* for click */}
        <Route path="/click" element={<ClickList />} />
        <Route path="/click/new" element={<New />} />
        {/* Layout with tabs */}
        <Route path="/click/:id" element={<ClickLayout />}>
          <Route path="detail" element={<ClickDetails />} />
          <Route path="account-balance" element={<AccountTab />} />
          <Route path="contacts" element={<ContactTab />} />
          <Route path="affiliates" element={<AffiliateTab />} />
          <Route path="postback-url" element={<PostbackTab />} />
          
          {/* Redirect to General tab by default */}
          <Route index element={<Navigate to="detail" replace />} />
        </Route>


        </Routes>
          


      </div>
    </div>

    </>
  );
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
