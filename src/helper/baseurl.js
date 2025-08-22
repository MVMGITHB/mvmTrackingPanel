import axios from "axios";
 
// Create an axios instance with your base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
 
export default api;