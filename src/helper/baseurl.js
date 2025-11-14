import axios from "axios";
 
// Create an axios instance with your base URL
const api = axios.create({
  // baseURL: "http://localhost:5011/api",
  baseURL: "https://offer.mvmtracking.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});
 
export default api;