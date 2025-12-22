import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";

export default function AdvertiserForm() {
  const [auth] = useAuth();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    AdId: "",
    status: "Active",
    manager: "",
  });

  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH MANAGERS ================= */
  useEffect(() => {
    if (!auth?.token) return;

    axios
      .get(`${baseurl}/api/users/getAllUser`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setManagers(res.data?.data || res.data || []);
      })
      .catch((err) =>
        console.error("Error fetching managers", err.response?.data || err)
      );
  }, [auth?.token]);

  /* ================= FETCH ADVERTISER (EDIT MODE) ================= */
  useEffect(() => {
    if (!id || !auth?.token) return;

    axios
      .get(`${baseurl}/api/advertisers/getOne/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        const advertiser = res.data?.data;
        if (advertiser) {
          setFormData({
            name: advertiser.name || "",
            AdId: advertiser.AdId || "",
            status: advertiser.status || "Active",
            manager: advertiser.manager?._id || "",
          });
        }
      })
      .catch((err) =>
        console.error("Error fetching advertiser", err.response?.data || err)
      );
  }, [id, auth?.token]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        AdId: Number(formData.AdId), // ✅ ENSURE NUMBER
      };

      if (id) {
        // UPDATE
        await axios.patch(
          `${baseurl}/api/advertisers/update/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        alert("Advertiser updated successfully!");
      } else {
        // CREATE
        await axios.post(
          `${baseurl}/api/advertisers/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        alert("Advertiser created successfully!");
        setFormData({
          name: "",
          AdId: "",
          status: "Active",
          manager: "",
        });
      }
    } catch (err) {
      console.error("Save advertiser error:", err.response?.data || err);
      alert(err.response?.data?.message || "Error saving advertiser");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full h-[50px] px-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-200";

  return (
    <div className="mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
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
            required
          />
        </div>

        {/* Ad ID */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Advertiser ID<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="AdId"
            value={formData.AdId}
            onChange={handleChange}
            className={inputStyle}
            required
            disabled={!!id} 
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
          className="w-[300px] mx-auto h-[50px] bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
