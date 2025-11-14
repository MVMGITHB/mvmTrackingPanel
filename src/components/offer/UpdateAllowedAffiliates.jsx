import React, { useState, useEffect } from "react";
import { Select, Button, Spin } from "antd";
import axios from "axios";
import { toast } from "react-toastify"; // no toast.configure() here
import { baseurl } from "../../helper/Helper";

const { Option } = Select;

const UpdateAllowedAffiliates = ({ compaignId }) => {
  const [advertisers, setAdvertisers] = useState([]);
  const [selectedAffiliates, setSelectedAffiliates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch all affiliates
  const fetchAffiliates = async () => {
    try {
      const res = await axios.get(`${baseurl}/api/affiliates/getAllAffiliate`);
      setAdvertisers(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load affiliates.");
    }
  };


  
  // Fetch campaign by ID
  const fetchCompaign = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseurl}/api/compaigns/getOneCompaign/${compaignId}`);
      const compaign = res.data.data;
      console.log(compaign)
      if (compaign && compaign.allowedAffiliates) {
        const ids = compaign?.allowedAffiliates?.map((a) => a);
        setSelectedAffiliates(ids);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load campaign data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAffiliates();
    fetchCompaign();
  }, [compaignId]);

  console.log("selectedAffiliates",selectedAffiliates)

  const handleUpdate = async () => {
    
    setUpdating(true);
    try {
      const res = await axios.patch(
        `${baseurl}/api/compaigns/allowed-affiliates/${compaignId}`,
        { allowedAffiliates: selectedAffiliates }
      );
      toast.success("Allowed affiliates updated successfully!");
      console.log("Updated:", res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update allowed affiliates.");
    }
    setUpdating(false);
  };

  return (
    <div className=" w-[80%] mx-auto bg-blue-50 shadow-lg p-6 rounded-lg mt-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Update Allowed Affiliates
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <label className="block text-gray-700 font-medium mb-2">
            Select Affiliates
          </label>
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="Select affiliates"
            className="w-full mb-4"
            value={selectedAffiliates}
            onChange={setSelectedAffiliates}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {advertisers.map((adv) => (
              <Option key={adv._id} value={adv._id}>
                {adv.email}
              </Option>
            ))}
          </Select>

          <Button
            type="primary"
            className="w-[30%] p-4 mt-5 bg-blue-600 hover:bg-blue-700"
            onClick={handleUpdate}
            loading={updating}
          >
            Update Affiliates
          </Button>
        </>
      )}
    </div>
  );
};

export default UpdateAllowedAffiliates;
