// tabs/GeneralTab.jsx
import AdvertiserForm from "./AdvertiserForm";
export const GeneralTab = () => {
  return <div>
     <AdvertiserForm/>
  </div>;
};


import { useParams } from "react-router-dom";
// tabs/AccountTab.jsx
export const AccountTab = () => {
  return <div>Account Balance Content</div>;
};

// tabs/ContactTab.jsx
export const ContactTab = () => {
  return <div>Contact Content</div>;
};

// tabs/AffiliateTab.jsx
export const AffiliateTab = () => {

    const { id } = useParams();
  return <div>
    Affiliate Content
    id:{id}
    </div>;
};

// tabs/PostbackTab.jsx
export const PostbackTab = () => {
  return <div>Postback Content</div>;
};
