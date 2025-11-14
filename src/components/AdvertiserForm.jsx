import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { baseurl } from "../helper/Helper";

export default function AdvertiserForm() {
  
  const { id } = useParams(); // get id from URL
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    manager: "",
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch managers list
  useEffect(() => {
    axios
      .get(`${baseurl}/api/users/getAllUser`)
      .then((res) => setManagers(res.data))
      .catch((err) => console.error("Error fetching managers", err));
  }, []);

  // Fetch advertiser data if editing
  useEffect(() => {
    if (id) {
      axios
        .get(`${baseurl}/api/advertisers/getOne/${id}`)
        .then((res) => {
          if (res.data && res.data.data) {
            setFormData({
              name: res.data.data.name || "",
              status: res.data.data.status || "Active",
              manager: res.data.data.manager._id || "",
            });
          }
        })
        .catch((err) => console.error("Error fetching advertiser", err));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        // update existing advertiser
        await axios.patch(`${baseurl}/api/advertisers/update/${id}`, formData);
        alert("Advertiser updated successfully!");
      } else {
        // create new advertiser
        await axios.post(`${baseurl}/api/advertisers/create`, formData);
        alert("Advertiser created successfully!");
        setFormData({ name: "", status: "Active", manager: "" });
      }
    } catch (err) {
      console.error(err);
      alert("Error saving advertiser");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full h-[50px] px-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-200";

  return (
    <div className=" mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {id ? "Edit Advertiser" : "Create Advertiser"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputStyle}
            placeholder="Enter advertiser name"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Status<span className="text-red-500">*</span>
          </label>
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
        </div>

        {/* Manager */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Manager<span className="text-red-500">*</span>
          </label>
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
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className=" w-[300px] mx-auto h-[50px] bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
