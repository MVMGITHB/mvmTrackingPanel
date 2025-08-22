import React, { useState } from "react";

const PublisherPanel = () => {
  const tabs = ["General Information", "Account Balance", "Contact", "Affiliate", "Postback"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "General Information" && (
          <div>
            <h2 className="text-lg font-bold">Advertiser information</h2>
            <p className="text-gray-500 mb-6">
              Define the internal information and details to identify the advertiser.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="Test Advertiser"
                  className="mt-1 w-full border border-gray-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block font-medium">
                  Status <span className="text-red-500">*</span>
                </label>
                <select className="mt-1 w-full border border-gray-300 rounded p-2">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">
                  Advertiser Manager <span className="text-red-500">*</span>
                </label>
                <select className="mt-1 w-full border border-gray-300 rounded p-2">
                  <option>1 - Mohit Papnoi</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Tags</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded p-2"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "Account Balance" && (
          <div>
            <h2 className="text-lg font-bold">Account Balance</h2>
            <p className="text-gray-500">Account balance details go here.</p>
          </div>
        )}

        {activeTab === "Contact" && (
          <div>
            <h2 className="text-lg font-bold">Contact Information</h2>
            <p className="text-gray-500">Contact details form goes here.</p>
          </div>
        )}

        {activeTab === "Affiliate" && (
          <div>
            <h2 className="text-lg font-bold">Affiliate Information</h2>
            <p className="text-gray-500">Affiliate-related details go here.</p>
          </div>
        )}

        {activeTab === "Postback" && (
          <div>
            <h2 className="text-lg font-bold">Postback URL</h2>
            <p className="text-gray-500">Postback settings form goes here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublisherPanel;
