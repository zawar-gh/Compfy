import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is not defined");
}

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Drops the request if it takes longer than 10 seconds
});

// 🔹 Request Interceptor
client.interceptors.request.use(
  (config) => {
    // Only attach the token from localStorage if one hasn't ALREADY been set manually
    if (!config.headers.Authorization) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor
client.interceptors.response.use(
  (response) => response, // Pass successful responses through normally
  (error) => {
    // Global handling for 401 Unauthorized (e.g., token expired)
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Clearing token...");
      localStorage.removeItem("access_token");
      
      // Optional: Redirect the user to the login page automatically
      // window.location.href = '/login'; 
    }
    
    return Promise.reject(error);
  }
);

export default client;