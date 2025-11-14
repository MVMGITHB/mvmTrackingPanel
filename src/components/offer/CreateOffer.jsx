import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../../helper/Helper";

export default function CreateOffer() {
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
    visibility:""
  });

  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tracking URL builder state
  const [baseUrl, setBaseUrl] = useState("https://yourdomain.com/tracking");
  const [params, setParams] = useState([
    { key: "click_id", value: "{click_id}" },
    { key: "payout", value: "{payout}" },
  ]);


   const fetchAdvertisers = async () => {
    try {
      const res = await axios.get(`${baseurl}/api/advertisers/getAll`);
      setAdvertisers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    
    fetchAdvertisers();
  }, []);

  // Update tracking URL dynamically
  useEffect(() => {
    const query = params
      .filter((p) => p.key && p.value)
      .map((p) => `${encodeURIComponent(p.key)}=${p.value.trim()}`)
      .join("&");
    setFormData((prev) => ({
      ...prev,
      trakingUrl: `${baseUrl}${query ? "?" + query : ""}`,
    }));
  }, [baseUrl, params]);

  // Fetch advertisers
  useEffect(() => {
    axios
      .get(`${baseurl}/api/advertisers/getAllAdvertisers`)
      .then((res) => setAdvertisers(res.data))
      .catch((err) => console.error("Error fetching advertisers", err));
  }, []);

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
      await axios.post(`${baseurl}/api/compaigns/creteCompaign`, formData);
      alert("Compaign created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating compaign");
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
 <div className="mx-auto bg-blue-50 shadow-lg rounded-2xl p-8 mt-10 border border-blue-100">
  <h2 className="text-3xl font-bold mb-8 text-gray-800">Create Campaign</h2>

  <form onSubmit={handleSubmit} className="space-y-6">

    {/* Offer Name */}
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Offer Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="offerName"
        value={formData.offerName}
        onChange={handleChange}
        className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        placeholder="Enter offer name"
        required
      />
    </div>

    {/* Status */}
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Status</label>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400"
      >
        {["Active", "Blocked", "Deleted", "Pause", "Pending", "Rejected"].map(
          (s) => (
            <option key={s} value={s}>
              {s}
            </option>
          )
        )}
      </select>
    </div>

    {/* Devices */}
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Devices</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["cctv", "mobile", "tablet", "desktop"].map((device) => (
          <label
            key={device}
            className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-2 shadow-sm"
          >
            <input
              type="checkbox"
              value={device}
              checked={formData.devices.includes(device)}
              onChange={handleDeviceChange}
            />
            <span className="capitalize">{device}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Dates */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Start Date
        </label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          End Date
        </label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>

    {/* Type */}
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Type</label>
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400"
      >
        <option value="web">Web</option>
        <option value="app">App</option>
        <option value="apk">APK</option>
      </select>
    </div>

    {/* Payout */}
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Payout</label>
      <input
        type="text"
        name="payout"
        value={formData.payout}
        onChange={handleChange}
        className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400"
        placeholder="Enter payout (e.g. 10.00)"
      />
    </div>

    {/* Advertiser */}
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Advertiser
      </label>
      <select
        name="advertiser"
        value={formData.advertiser}
        onChange={handleChange}
        className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select Advertiser</option>
        {advertisers.map((adv) => (
          <option key={adv._id} value={adv._id}>
            {adv.name}
          </option>
        ))}
      </select>
    </div>

    {/* Visibility */}
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Visibility
      </label>
      <select
        name="visibility"
        value={formData.visibility}
        onChange={handleChange}
        className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select Visibility</option>
        <option value="Public">Public</option>
        <option value="Private">Private</option>
      </select>
    </div>

    {/* TRACKING URL BUILDER */}
    <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
      <label className="block text-gray-700 font-semibold mb-3">
        Tracking URL
      </label>

      {/* Base URL */}
      <input
        type="url"
        value={baseUrl}
        onChange={(e) => setBaseUrl(e.target.value)}
        className="w-full bg-blue-50 border border-blue-300 rounded-lg px-3 py-3 shadow-sm focus:ring-2 focus:ring-blue-400"
        placeholder="https://yourdomain.com/track"
      />

      {/* Params */}
      <div className="mt-4 space-y-3">
        {params.map((p, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={p.key}
              onChange={(e) => updateParam(i, "key", e.target.value)}
              className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-2 shadow-sm"
              placeholder="Key"
            />
            <input
              type="text"
              value={p.value}
              onChange={(e) => updateParam(i, "value", e.target.value)}
              className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-2 shadow-sm"
              placeholder="Value"
            />
            <button
              type="button"
              onClick={() => removeParam(i)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addParam}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          + Add parameter
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600 break-all">
        <strong>Generated URL:</strong> {formData.trakingUrl}
      </p>
    </div>

    {/* Submit */}
    <div className="text-center pt-4">
      <button
        type="submit"
        disabled={loading}
        className="w-[260px] h-[48px] bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
      >
        {loading ? "Saving..." : "Save Campaign"}
      </button>
    </div>
  </form>
</div>

  );
}
