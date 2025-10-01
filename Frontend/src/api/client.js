import axios from "axios";

const API = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

const client = axios.create({
  baseURL: API,
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
