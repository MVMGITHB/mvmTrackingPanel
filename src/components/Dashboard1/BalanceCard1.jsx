import axios from "axios";
import React,{useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import { baseurl } from "../../helper/Helper";

const BalanceCard = () => {

const [stored, setStore] = useState(null);

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("auth"));
  if (user) {
    setStore(user);
  }

}, []);

console.log(stored)

  return (
    <div className="flex flex-col md:flex-row gap-6  bg-blue-50 p-6 rounded-2xl">
      {/* Left Card - Personal Manager */}
      <div className="flex-1 bg-blue-50 rounded-xl shadow-md p-6 flex items-start gap-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="avatar"
          className="w-14 h-14 rounded-full object-cover border"
        />
        <div>
          <p className="text-gray-500 text-sm font-medium">Personal Manager</p>
          <h2 className="text-lg font-semibold text-gray-900">
            {stored?.user?.name || "N/A"}
          </h2>
          <p className="text-sm text-gray-500">
            Email:{" "}
            <a
              href={`mailto:${stored?.email}`}
              className="text-blue-600 hover:underline"
            >
              {stored?.user?.email || "N/A"}
            </a>
          </p>

          {/* <div className="mt-3">
            <p className="text-gray-600 text-sm">Balance</p>
            <h3 className="text-2xl font-bold text-green-600">
              28331.604 <span className="text-base font-medium">INR</span>
            </h3>
          </div> */}
        </div>
      </div>

     
    </div>
  );
};

export default BalanceCard;
