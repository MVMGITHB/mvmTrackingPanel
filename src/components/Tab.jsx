// tabs/GeneralTab.jsx
import AdvertiserForm from "./AdvertiserForm";
export const GeneralTab = () => {
  return <div>
     <AdvertiserForm/>
  </div>;
};


import UpdateAllowedAffiliates from "./offer/UpdateAllowedAffiliates";
import StatisticsPage from './affiliate/StatisticsPage'
import { baseurl } from "../helper/Helper";
import Marketplace from "./affiliate/Marketplace";
import Conversion from "./affiliate/Conversion"

import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
// tabs/AccountTab.jsx
export const AccountTab = () => {
 const { id } = useParams();

    useEffect(() => {
    const fetchAffiliate = async () => {
      try {
        const response = await axios.get(
          `${baseurl}/api/affiliates/getOneAffiliate/${id}`
        );

        const data = response.data;

        // 👉 Store in localStorage
        localStorage.setItem("user1", JSON.stringify(data));

        console.log("Stored Affiliate Data:", data);

      } catch (error) {
        console.error("Error fetching affiliate:", error);
      }
    };

    fetchAffiliate();
  }, [id]);

  return <div>
       <StatisticsPage id={id}/></div>;
};

// tabs/ContactTab.jsx
export const ContactTab = () => {


   const { id } = useParams();

    useEffect(() => {
    const fetchAffiliate = async () => {
      try {
        const response = await axios.get(
          `${baseurl}/api/affiliates/getOneAffiliate/${id}`
        );

        const data = response.data;

        // 👉 Store in localStorage
        localStorage.setItem("user1", JSON.stringify(data));

        console.log("Stored Affiliate Data:", data);

      } catch (error) {
        console.error("Error fetching affiliate:", error);
      }
    };

    fetchAffiliate();
  }, [id]);
  return <div>
    <Marketplace/>
  </div>;
};

// tabs/AffiliateTab.jsx
export const AffiliateTab = () => {
      
    const { id } = useParams();

    useEffect(() => {
    const fetchAffiliate = async () => {
      try {
        const response = await axios.get(
          `${baseurl}/api/affiliates/getOneAffiliate/${id}`
        );

        const data = response.data;

        // 👉 Store in localStorage
        localStorage.setItem("user1", JSON.stringify(data));

      } catch (error) {
        console.error("Error fetching affiliate:", error);
      }
    };

    fetchAffiliate();
  }, [id]);


  return (
   <div>
       <Conversion id={id}/>
    </div>
    )
};

// tabs/PostbackTab.jsx
export const PostbackTab = () => {
  return <div>Postback Content
    <Conversion/>
  </div>;
};
