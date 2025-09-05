import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { baseurl } from "../../helper/Helper";

export default function OfferGenral() {
  const { id } = useParams(); // edit mode ID
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    offerName: "",
    status: "Active",
    devices: [],
    startDate: "",
    endDate: "",
    type: "web",
    trakingUrl: "",
    payout: "",
    advertiser: "",
  });

  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tracking URL state
  const [baseUrl, setBaseUrl] = useState("https://yourdomain.com/tracking");
  const [params, setParams] = useState([
    { key: "click_id", value: "{click_id}" },
    { key: "payout", value: "{payout}" },
  ]);

  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch advertisers
  const fetchAdvertisers = async () => {
    try {
      const res = await axios.get(`${baseurl}/api/advertisers/getAll`);
      setAdvertisers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching advertisers", err);
    }
  };

  // Fetch campaign if editing
  const fetchCampaign = async () => {
    if (!id) return;
    try {
      const res = await axios.get(
        `${baseurl}/api/compaigns/getOneCompaign/${id}`
      );
      const data = res.data.data;

      console.log("Fetched campaign:", data);

      setFormData({
        offerName: data.offerName || "",
        status: data.status || "Active",
        devices: data.devices || [],
        startDate: data.startDate ? data.startDate.split("T")[0] : "",
        endDate: data.endDate ? data.endDate.split("T")[0] : "",
        type: data.type || "web",
        trakingUrl: data.trakingUrl || "",
        payout: data.payout || "",
        advertiser: data.advertiser?._id || data.advertiser || "",
      });

      // Extract baseUrl + params from existing tracking URL
      if (data.trakingUrl) {
        const [url, queryString] = data.trakingUrl.split("?");
        setBaseUrl(url);
        if (queryString) {
          const parsed = queryString.split("&").map((q) => {
            const [key, value] = q.split("=");
            return { key: decodeURIComponent(key), value: value || "" };
          });
          setParams(parsed);
        }
      }
    } catch (err) {
      console.error("Error fetching campaign", err);
    }
  };

  // Load advertisers first, then campaign
  useEffect(() => {
    const loadData = async () => {
      await fetchAdvertisers();
      await fetchCampaign();
      setInitialLoad(false);
    };
    loadData();
  }, [id]);

  // Build tracking URL dynamically (skip first load)
  useEffect(() => {
    if (initialLoad) return;

    const query = params
      .filter((p) => p.key && p.value)
      .map((p) => `${encodeURIComponent(p.key)}=${p.value.trim()}`)
      .join("&");

    setFormData((prev) => ({
      ...prev,
      trakingUrl: `${baseUrl}${query ? "?" + query : ""}`,
    }));
  }, [baseUrl, params, initialLoad]);

  // Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeviceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      devices: checked
        ? [...prev.devices, value]
        : prev.devices.filter((d) => d !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await axios.patch(
          `${baseurl}/api/compaigns/updateCompaign/${id}`,
          formData
        );
        alert("Compaign updated successfully!");
      } else {
        await axios.post(`${baseurl}/api/compaigns/creteCompaign`, formData);
        alert("Compaign created successfully!");
      }
      // navigate("/compaigns"); // optional redirect
    } catch (err) {
      console.error("Error saving compaign", err);
      alert("Error saving compaign");
    } finally {
      setLoading(false);
    }
  };

  const updateParam = (index, field, value) => {
    const updated = [...params];
    updated[index][field] = value;
    setParams(updated);
  };

  const addParam = () => setParams([...params, { key: "", value: "" }]);
  const removeParam = (index) =>
    setParams(params.filter((_, i) => i !== index));

  const inputStyle =
    "w-full h-[45px] px-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-200";

  return (
    <div className="mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {id ? "Edit Compaign" : "Create Compaign"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Offer Name */}
        <label className="block text-gray-700 font-semibold mb-2">
          Offer Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="offerName"
          value={formData.offerName}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Offer Name"
          required
        />

        {/* Status */}
        <label className="block text-gray-700 font-semibold mb-2">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={inputStyle}
        >
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
          <option value="Deleted">Deleted</option>
          <option value="Pause">Pause</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Devices */}
        <label className="block text-gray-700 font-semibold mb-2">
          Devices
        </label>
        <div className="flex gap-4">
          {["cctv", "mobile", "tablet", "desktop"].map((device) => (
            <label key={device} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={device}
                checked={formData.devices.includes(device)}
                onChange={handleDeviceChange}
              />
              {device}
            </label>
          ))}
        </div>

        {/* Dates */}
        <label className="block text-gray-700 font-semibold mb-2">
          Start Date
        </label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className={inputStyle}
        />

        <label className="block text-gray-700 font-semibold mb-2">
          End Date
        </label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className={inputStyle}
        />

        {/* Type */}
        <label className="block text-gray-700 font-semibold mb-2">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={inputStyle}
        >
          <option value="web">Web</option>
          <option value="app">App</option>
          <option value="apk">APK</option>
        </select>

        {/* Payout */}
        <label className="block text-gray-700 font-semibold mb-2">Payout</label>
        <input
          type="text"
          name="payout"
          value={formData.payout}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Enter payout (e.g. 10.00)"
        />

        {/* Advertiser */}
        <label className="block text-gray-700 font-semibold mb-2">
          Advertiser
        </label>
        <select
          name="advertiser"
          value={formData.advertiser}
          onChange={handleChange}
          className={inputStyle}
        >
          <option value="">Select Advertiser</option>
          {advertisers.map((adv) => (
            <option key={adv._id} value={adv._id}>
              {adv.name}
            </option>
          ))}
        </select>

        {/* ==== Tracking URL Builder ==== */}
        <div className="mt-3 space-y-2">
          <label className="block text-gray-700 font-semibold mb-2">
            Tracking URL
          </label>

          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className={inputStyle}
            placeholder="Enter base URL (e.g. https://yourdomain.com/tracking)"
          />

          {params.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={p.key}
                onChange={(e) => updateParam(i, "key", e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Parameter key"
              />
              <input
                type="text"
                value={p.value}
                onChange={(e) => updateParam(i, "value", e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Parameter value"
              />
              <button
                type="button"
                onClick={() => removeParam(i)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addParam}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            + Add parameter
          </button>
        </div>

        {/* Preview */}
        <p className="mt-3 text-sm text-gray-600 break-all">
          <strong>Generated URL:</strong> {formData.trakingUrl}
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-[300px] mx-auto h-[50px] bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : id ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
}
