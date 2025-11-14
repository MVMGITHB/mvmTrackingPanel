import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../../helper/Helper";
import { useParams } from "react-router-dom";

export default function AffiliateGenral() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    firstname: "",
    lastName: "",
    affiliateName: "",
    email: "",
    password: "",
    pubId: "",
    status: "Active",
    manager: "",
    postBackUrl: "",
  });

  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Postback builder state
  const [baseUrl, setBaseUrl] = useState("https://yourdomain.com/postback");
  const [params, setParams] = useState([
    { key: "click_id", value: "{click_id}" },
    { key: "payout", value: "{payout}" },
  ]);

  // Generate full URL whenever baseUrl or params change
  useEffect(() => {
    const query = params
      .filter((p) => p.key && p.value)
      .map((p) => `${encodeURIComponent(p.key)}=${p.value.trim()}`) // encode key, raw value
      .join("&");

    setFormData((prev) => ({
      ...prev,
      postBackUrl: `${baseUrl}${query ? "?" + query : ""}`,
    }));
  }, [baseUrl, params]);

  // Fetch managers list
  useEffect(() => {
    axios
      .get(`${baseurl}/api/users/getAllUser`)
      .then((res) => setManagers(res.data))
      .catch((err) => console.error("Error fetching managers", err));
  }, []);

  // Fetch affiliate by ID when editing
  useEffect(() => {
    if (!id) return;

    axios
      .get(`${baseurl}/api/affiliates/getOneAffiliate/${id}`)
      .then((res) => {
        const data = res.data;

        // Parse postback URL into baseUrl + params
        let parsedBaseUrl = data.postBackUrl || "";
        let parsedParams = [];

        if (parsedBaseUrl.includes("?")) {
          const [url, queryString] = parsedBaseUrl.split("?");
          parsedBaseUrl = url;

          parsedParams = queryString.split("&").map((pair) => {
            const [key, value] = pair.split("=");
            return {
              key: decodeURIComponent(key),
              value: decodeURIComponent(value || ""), // decode in case stored encoded
            };
          });
        }

        setFormData({
          firstname: data.firstname || "",
          lastName: data.lastName || "",
          affiliateName: data.affiliateName || "",
          email: data.email || "",
          password: "",
          pubId: data.pubId || "",
          status: data.status || "Active",
          manager: data.manager || "",
          postBackUrl: data.postBackUrl || "",
        });

        setBaseUrl(parsedBaseUrl || "");
        setParams(parsedParams.length ? parsedParams : []);
      })
      .catch((err) => {
        console.error("Error fetching affiliate by id", err);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${baseurl}/api/affiliates/updateAffiliate/${id}`,
        formData
      );
      alert("Affiliate updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating affiliate");
    } finally {
      setLoading(false);
    }
  };

  const updateParam = (index, field, value) => {
    const updated = [...params];
    updated[index][field] = value;
    setParams(updated);
  };

  const addParam = () => {
    setParams([...params, { key: "", value: "" }]);
  };

  const removeParam = (index) => {
    setParams(params.filter((_, i) => i !== index));
  };

  const inputStyle =
    "w-full h-[45px] px-3 bg-gradient-to-b from-[#e8f1ff] via-[#f4f8ff] to-[#ffffff] border border-gray-200 rounded-lg shadow-sm text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-200";

  return (
    <div className="mx-auto bg-gradient-to-b from-[#e8f1ff] via-[#f4f8ff] to-[#ffffff] shadow-lg rounded-2xl p-8 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Affiliate</h2>
      <form onSubmit={handleSubmit} className="space-y-5 bg-gradient-to-b from-[#e8f1ff] via-[#f4f8ff] to-[#ffffff]">
        {/* ==== Basic Affiliate Info ==== */}

        <label className="block text-gray-700 font-semibold mb-2">First Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          className={inputStyle}
          placeholder="First Name"
          required
        />


        <label className="block text-gray-700 font-semibold mb-2">Last Name <span className="text-red-500">*</span> </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Last Name"
          required
        />


        <label className="block text-gray-700 font-semibold mb-2">Affiliate Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="affiliateName"
          value={formData.affiliateName}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Affiliate Name"
          required
        />

        <label className="block text-gray-700 font-semibold mb-2">Email <span className="text-red-500">*</span></label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Email"
          required
        />

        {/* ==== Postback URL Builder ==== */}

        <label className="block text-gray-700 font-semibold mb-2">Postback Base URL </label>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className={inputStyle}
          placeholder="Base URL"
          required
        />

        {/* Params */}
        <div className="mt-3 space-y-2">
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
          <strong>Generated URL:</strong> {formData.postBackUrl}
        </p>

        {/* ==== Status + Manager ==== */}

        <label className="block text-gray-700 font-semibold mb-2">Status <span className="text-red-500">*</span></label>
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
         

          <label className="block text-gray-700 font-semibold mb-2">Manager <span className="text-red-500">*</span></label>
        <select
          name="manager"
          value={formData.manager}
          onChange={handleChange}
          className={inputStyle}
          required
        >
          <option value="">Select Manager</option>
          {managers.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-[300px] mx-auto h-[50px] bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
