import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Button, message, Spin } from "antd";
import { baseurl } from "../../../helper/Helper";

export default function AffiliateClickDetails() {
  const { clickId } = useParams();
  const id = clickId;
  const [click, setClick] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postbackLoading, setPostbackLoading] = useState(false);

  const toastSuccess = (text) => {
    message.open({
      type: "success",
      content: text,
      duration: 2,
      className: "custom-toast",
    });
  };

  const toastError = (text) => {
    message.open({
      type: "error",
      content: text,
      duration: 2,
      className: "custom-toast-error",
    });
  };

  const fetchClick = async () => {
    try {
      const res = await axios.get(`${baseurl}/api/clicks/getOne/${id}`);
      setClick(res.data.data);
    } catch (err) {
      toastError("Failed to load click details");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClick();
  }, [id]);

  const firePostback = async () => {
    if (!click) return;

    setPostbackLoading(true);
    try {
      const url = `${baseurl}/api/conversion/postback?click_id=${click.clickId}&amount=1`;
      await axios.get(url);
      toastSuccess("🔥 Postback fired successfully!");
    } catch (err) {
      toastError("⚠️ Postback failed!");
    }
    setPostbackLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className=" w-full mx-auto">

      {/* CARD CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          bg-gradient-to-br from-sky-50 via-white to-sky-100
          shadow-2xl rounded-2xl p-10 border border-sky-200 w-full
        "
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Click Details
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="text-sky-500"
          >
            ⚡
          </motion.span>
        </h1>

        {/* GRID DATA CARDS - NOW 100% WIDTH, 3 COLUMNS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <Detail label="Campaign ID" value={click.campaignId} />
          <Detail label="Publisher ID" value={click.pubId} />
          <Detail label="Click ID" value={click.clickId} />
          <Detail label="Device ID" value={click.deviceId || "-"} />
          <Detail label="IP Address" value={click.ip} />
          <Detail label="User Agent" value={click.userAgent} long />
          <Detail label="Unique Click" value={click.isUnique ? "Yes" : "No"} />
          <Detail
            label="Timestamp"
            value={new Date(click.timestamp).toLocaleString()}
          />
        </div>

        {/* POSTBACK BUTTON */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex justify-end"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="primary"
              loading={postbackLoading}
              onClick={firePostback}
              style={{
                padding: "10px 26px",
                fontSize: "16px",
                background: "linear-gradient(90deg, #0284c7, #0ea5e9)",
                borderRadius: "10px",
                boxShadow: "0px 4px 12px rgba(0, 130, 200, 0.4)",
              }}
            >
              🚀 Fire Postback
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="
        p-4 rounded-xl bg-white shadow-md border border-sky-100
        hover:shadow-lg hover:bg-sky-50 transition-all duration-300
        h-full
      "
    >
      <p className="text-sm text-sky-600 font-medium">{label}</p>

      {/* ALWAYS WRAP TEXT */}
      <p className="mt-1 text-gray-800 font-semibold break-words whitespace-normal">
        {value}
      </p>
    </motion.div>
  );
}
