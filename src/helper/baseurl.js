import axios from "axios";
 
// Create an axios instance with your base URL
const api = axios.create({
  baseURL: "https://trakingbackend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});
 
export default api;