// import axios from "axios";
 
// // Create an axios instance with your base URL
// const api = axios.create({
//   baseURL: "http://localhost:5011/api",
//   // baseURL: "https://offer.mvmtracking.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
 
// export default api;



import axios from "axios";

// Create axios instance
const api = axios.create({
  // baseURL: "http://localhost:5011/api",
  baseURL: "https://offer.mvmtracking.com/api",
});

// Attach token dynamically
api.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
