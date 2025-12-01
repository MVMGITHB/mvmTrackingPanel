import React, { useEffect, useState } from "react";
import api from "../baseurl/baseurl";
import { ClipboardCopy, RefreshCw, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseurl } from "../../helper/Helper";

// --- Helpers ---
// function safeParse(raw) {
//   try {
//     if (!raw || raw === "undefined") return null;
//     return JSON.parse(raw);
//   } catch (e) {
//     console.error("safeParse: failed to parse", e);
//     return null;
//   }
// }

// function extractAffiliateData(stored) {
//   if (!stored) return null;
//   return {
//     id: stored.id || stored.affiliate?.id || stored.user?.id || null,
//     name: stored.name || stored.affiliate?.name || stored.user?.name || "User",
//     email:
//       stored.email || stored.affiliate?.email || stored.user?.email || null,
//     pubId:
//       stored.pubId || stored.affiliate?.pubId || stored.user?.pubId || null,
//     postBackUrl:
//       stored.postBackUrl ||
//       stored.affiliate?.postBackUrl ||
//       stored.user?.postBackUrl ||
//       null,
//   };
// }
// ----------------

export default function OfferDetailsFull({ offer }) {
  const [offerData, setOfferData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [pubId, setPubId] = useState(null);

  // // Get pubId from localStorage
  // useEffect(() => {
  //   const raw = localStorage.getItem("user1");
    
  //   console.log("raw",raw)

  //   setPubId(raw?.pubId || 1); // fallback
  // }, []);


  const { id } = useParams();
  
      useEffect(() => {
      const fetchAffiliate = async () => {
        try {
          const response = await axios.get(
            `${baseurl}/api/affiliates/getOneAffiliate/${id}`
          );
  
          const data = response.data;
          setPubId(data?.pubId)
          setRow(data)
  
  
        } catch (error) {
          console.error("Error fetching affiliate:", error);
        }
      };
  
      fetchAffiliate();
    }, [id]);


  useEffect(() => {
    if (!offer?._id) return;
    let mounted = true;

    async function fetchOffer() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/compaigns/getOneCompaign/${offer._id}`);
        if (!mounted) return;
        if (res.data?.success) setOfferData(res.data.data);
        else setError(res.data?.message || "Failed to fetch offer");
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Network error");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchOffer();
    return () => (mounted = false);
  }, [offer]);

  if (!offer) return null;
  if (loading)
    return <p className="text-center py-6 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-6 text-red-500">{error}</p>;
  if (!offerData) return null;

  const o = offerData;

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const buildTrackingUrl = (compId, pubId) =>
    `https://offer.mvmtracking.com/api/clicks?campaign_id=${compId}&pub_id=${pubId}&affiliate_id={your_id}&sub1={your_sub}`;

  // Static labels
  const accessibility = "Accessible";
  const incentivized = "Not allowed";
  const conversionModel = "CPA";
  const conversionFlow = "TWO_CLICK";
  const productType = o.type?.toUpperCase() || "WEB";
  const countries = "Worldwide";
  const carriers = "All carriers";
  const platformsLabel = o.devices?.length
    ? o.devices.join(", ")
    : "All platforms";
  const eventType = "Default";
  const isRepeatable = "No";

  return (
    <div className="w-full grid grid-cols-1 gap-6 md:grid-cols-12">

  {/* LEFT COLUMN — DETAILS CARD */}
  <div className="md:col-span-4 bg-blue-50 border border-blue-100 rounded-2xl shadow-md overflow-hidden">
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-700">Details</h3>
        <span
          className={`text-sm px-3 py-1 rounded-full text-white font-medium ${
            o.status === "Active" ? "bg-green-600" : "bg-gray-500"
          }`}
        >
          {o.status}
        </span>
      </div>

      {/* Items */}
      <div className="divide-y divide-blue-100">
        {[
          ["Accessibility", accessibility],
          ["Incent traffic", incentivized],
          ["Conversion model", conversionModel],
          ["Conversion flow", conversionFlow],
          ["Product type", productType],
          ["Platforms", platformsLabel],
          ["Countries", countries],
          ["Carriers", carriers],
          ["Categories", "All categories"],
          ["Tags", "No tags"],
        ].map(([label, value], idx) => (
          <div
            key={idx}
            className="py-3 flex items-center justify-between text-sm"
          >
            <span className="font-medium text-gray-600">{label}</span>

            <span
              className={`inline-block px-2 py-1 rounded text-gray-700 text-xs ${
                label.includes("Conversion")
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100"
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

    </div>
  </div>

  {/* RIGHT COLUMN */}
  <div className="md:col-span-8 space-y-6">

    {/* TRACKING URL */}
    <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-md overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-blue-100">
        <h3 className="text-lg font-semibold text-gray-700">Offer Tracking URL</h3>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleCopy(buildTrackingUrl(o.compId, pubId))}
            className="flex items-center gap-2 text-sm px-3 py-1 rounded bg-white shadow hover:bg-gray-50 transition"
          >
            <ClipboardCopy className="w-4 h-4" />
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            onClick={() => window.alert("Open URL builder (implement)")}
            className="flex items-center gap-2 text-sm px-3 py-1 rounded bg-white shadow hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-4 h-4" /> URL builder
          </button>
        </div>
      </div>

      <div className="p-4 break-words text-blue-700 font-medium">
        <a
          href={buildTrackingUrl(o.compId, pubId)}
          target="_blank"
          rel="noreferrer"
        >
          {buildTrackingUrl(o.compId, pubId)}
        </a>
      </div>
    </div>

    {/* EVENTS / PAYOUTS */}
    <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-md overflow-hidden">
      <div className="p-4 border-b border-blue-100 bg-blue-100">
        <h3 className="text-lg font-semibold text-gray-700">Events / Payouts</h3>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-700">
              <th className="pb-3">Countries</th>
              <th className="pb-3">Carriers</th>
              <th className="pb-3">Platforms</th>
              <th className="pb-3">Event type</th>
              <th className="pb-3">Repeatable</th>
              <th className="pb-3">Payout</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-blue-100">
              <td className="py-3">{countries}</td>

              <td className="py-3">
                <span className="border rounded px-2 py-1 bg-white shadow text-xs">
                  {carriers}
                </span>
              </td>

              <td className="py-3">
                <span className="border rounded px-2 py-1 bg-white shadow text-xs">
                  {platformsLabel}
                </span>
              </td>

              <td className="py-3">{eventType}</td>
              <td className="py-3">{isRepeatable}</td>

              <td className="py-3">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                  ${o.payout ?? "0.00"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* CREATIVES */}
    <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Creatives</h3>

      <div className="min-h-[60px] text-sm text-gray-500">
        No creatives uploaded.
      </div>
    </div>

    {/* KPI + POSTBACK LINKS */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* KPI */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-md p-4">
        <h4 className="font-semibold mb-3 text-gray-700">KPI</h4>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">{o.clicks ?? 0}</div>
            <div className="text-xs text-gray-500">Clicks</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-gray-800">{o.conversions ?? 0}</div>
            <div className="text-xs text-gray-500">Conversions</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-gray-800">${o.saleAmount ?? 0}</    div>
            <div className="text-xs text-gray-500">Sale Amount</div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500">Conversion Rate</div>
          <div className="text-lg font-semibold text-gray-800">
            {(o.conversionRate ?? 0).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* POSTBACK LINKS */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-blue-100">
          <h4 className="font-semibold text-gray-700">Postback Links</h4>

          <button
            onClick={() => window.alert("Add postback link (implement)")}
            className="flex items-center gap-2 text-sm px-3 py-1 rounded bg-white shadow hover:bg-gray-50 transition"
          >
            <Plus className="w-4 h-4" /> Add link
          </button>
        </div>

        <div className="p-4 text-sm text-gray-600">
          {o.postbackLinks && o.postbackLinks.length > 0 ? (
            <ul className="space-y-2">
              {o.postbackLinks.map((p, i) => (
                <li key={i} className="break-words bg-white p-2 rounded shadow text-gray-700">
                  {p}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <div className="text-4xl">🔗</div>
              <div className="mt-2">No postback links yet.</div>
              <div className="mt-1 text-xs">Click “Add postback link”</div>
            </div>
          )}
        </div>
      </div>

    </div>
  </div>

</div>

  );
}
