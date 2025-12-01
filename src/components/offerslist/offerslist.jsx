import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Copy,
  Globe,
  Smartphone,
  Monitor,
  Loader2,
  Star,
  ListChecks,
  Globe2,
} from "lucide-react";
import toast from "react-hot-toast";
import OfferDetails from "../offerDetails/offerdetails";
import api from "../baseurl/baseurl";
import { baseurl } from "../../helper/Helper";
import { useParams } from "react-router-dom";
import axios from "axios";

// --- Helpers (same as OfferDetailsFull) ---
function safeParse(raw) {
  try {
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function extractAffiliateData(stored) {
  if (!stored) return null;
  return stored.pubId || stored.affiliate?.pubId || stored.user?.pubId || null;
}
// -----------------------------------------

export default function OffersTable() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pubId, setPubId] = useState(1); // default fallback
  const[comId,setCompId] = useState()
  const[row,setRow] = useState()
 
  // // ✅ Get pubId from localStorage
  // useEffect(() => {
  //   const raw = JSON.parse(localStorage.getItem("user1"));
  //   const parsed = safeParse(raw);
  //   setPubId(raw.pubId); // fallback to 1
  //   console.log("raw",raw._id)
  //   setCompId(raw?._id)
  // }, []);





  const { id  } = useParams();

 const location = useLocation();

  const tab = location.pathname.split("/").pop(); // 👈 last part of URL
  console.log("Tab:", tab);


    useEffect(() => {
    const fetchAffiliate = async () => {
      try {
        const response = await axios.get(
          `${baseurl}/api/affiliates/getOneAffiliate/${id}`
        );

        const data = response.data;
        setPubId(data?.pubId)
        setRow(data)
         

        if(response?.data){
        try {

        const response = await api.get(`/compaigns/getALLCompaigns?affiliateId=${data?._id}`);
        if (response.data?.success) {
          setCampaigns(response.data.data);
        }
        
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
        }

        



      } catch (error) {
        console.error("Error fetching affiliate:", error);
      }
    };

    fetchAffiliate();
  }, [id,tab]);



  const buildTrackingUrl = (compId, pubId) =>
    `${baseurl}/api/clicks?campaign_id=${compId}&pub_id=${pubId}&affiliate_id={your_id}&sub1={your_sub}`;

  const filteredOffers = campaigns.filter((offer) => {
    if (activeTab === "featured") return offer.featured;
    if (activeTab === "my") return offer.compId === 370; // example
    return true;
  });

  const savedAffiliate = JSON.parse(localStorage.getItem("affiliate"));
 

  // useEffect(() => {
  //   async function fetchCampaigns() {


  //     try {

  //       const response = await api.get(`/compaigns/getALLCompaigns?affiliateId=${row?._id}`);
  //       if (response.data?.success) {
  //         setCampaigns(response.data.data);
  //       }
        
  //     } catch (error) {
  //       console.error("Error fetching campaigns:", error);
  //       toast.error("Failed to load campaigns");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchCampaigns();
  // }, [id]);

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Tracking URL copied!");
    } catch {
      toast.error("Failed to copy!");
    }
  };

  const tabs = [
    { key: "all", label: "All Offers", icon: Globe2 },
    { key: "featured", label: "Featured", icon: Star },
    { key: "my", label: "My Offers", icon: ListChecks },
  ];

  return (
    <div className="bg-blue-50 rounded-2xl shadow-lg p-4 md:p-6 border border-blue-100">

  {/* TABS */}
  <div className="flex flex-wrap gap-2 md:gap-3 pb-4 border-b border-blue-100">
    {tabs.map(({ key, label, icon: Icon }) => (
      <button
        key={key}
        onClick={() => setActiveTab(key)}
        className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all duration-300
          ${
            activeTab === key
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-blue-100 hover:text-blue-600 border border-blue-200"
          }
        `}
      >
        <Icon size={16} /> {label}
      </button>
    ))}
  </div>

  {/* TABLE */}
  <div className="overflow-x-auto mt-6">
    {loading ? (
      <div className="py-12 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    ) : (
      <table className="min-w-full border-collapse text-sm md:text-base">
        {/* Table Header */}
        <thead className="bg-blue-100 sticky top-0 z-10 border-b border-blue-200">
          <tr>
            {["Offer", "Offer ID", "Model", "Payout", "Platforms", "Status", "Actions"].map(
              (heading) => (
                <th
                  key={heading}
                  className="px-3 md:px-4 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wide"
                >
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {filteredOffers.map((offer, index) => (
            <tr
              key={offer._id}
              className={`transition ${
                index % 2 === 0
                  ? "bg-blue-50 hover:bg-blue-100"
                  : "bg-blue-100 hover:bg-blue-200"
              }`}
            >
              {/* Offer Name */}
              <td
                className="px-3 md:px-4 py-2 flex items-center gap-3 cursor-pointer"
                onClick={() => setSelectedOffer(offer)}
              >
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-500 shadow border border-blue-100">
                  <Globe size={18} />
                </div>

                <span className="font-medium text-gray-800 hover:text-blue-600 truncate max-w-[180px] md:max-w-[260px]">
                  {offer.offerName}
                </span>
              </td>

              {/* Offer ID */}
              <td className="px-3 md:px-4 py-2 text-gray-700">{offer.compId}</td>

              {/* Model */}
              <td className="px-3 md:px-4 py-2">
                <span className="px-2 py-1 text-xs md:text-sm rounded-full bg-blue-200 text-blue-700 font-medium">
                  {offer.type || "N/A"}
                </span>
              </td>

              {/* Payout */}
              <td className="px-3 md:px-4 py-2 text-green-700 font-semibold">
                {offer.payout || "N/A"}
              </td>

              {/* Platforms */}
              <td className="px-3 md:px-4 py-2 flex gap-2">
                {offer.devices?.includes("desktop") && (
                  <Monitor size={16} className="text-gray-700" />
                )}
                {offer.devices?.includes("mobile") && (
                  <Smartphone size={16} className="text-gray-700" />
                )}
              </td>

              {/* Status */}
              <td className="px-3 md:px-4 py-2">
                <span
                  className={`px-2 py-1 text-xs md:text-sm rounded-full font-medium ${
                    offer.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {offer.status || "Unknown"}
                </span>
              </td>

              {/* Copy Button */}
              <td className="px-3 md:px-4 py-2">
                <button
                  onClick={() =>
                    copyToClipboard(buildTrackingUrl(offer.compId, pubId))
                  }
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-xs md:text-sm font-medium"
                >
                  <Copy size={14} /> Copy URL
                </button>
              </td>
            </tr>
          ))}

          {filteredOffers.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-8 text-gray-500">
                No campaigns found for this tab.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>

  {/* OFFER DETAILS */}
  {selectedOffer && (
    <div className="mt-6 border-t border-blue-100 pt-6">
      <OfferDetails offer={selectedOffer} />
    </div>
  )}

</div>

  );
}
