//-------api.ts----------------
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

// 🔹 Helper to get auth headers
const getAuthHeaders = (token?: string) => {
  const accessToken = token ?? localStorage.getItem("access_token");
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

// ------------------- Shops -------------------

// Register a new shop/vendor
export const registerShop = async (shopData: any, token?: string) => {
  const res = await axios.post(`${API_BASE}/shops/`, shopData, {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

// Get all shops
export const getShops = async (token?: string) => {
  const res = await axios.get(`${API_BASE}/shops/`, {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

// ------------------- Inventory -------------------

// Fetch inventory for a vendor/shop
export const getInventory = async (vendorId: number, token?: string) => {
  const res = await axios.get(`${API_BASE}/inventory/${vendorId}/`, {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

// Bulk update inventory
export const bulkUpdateInventory = async (vendorId: number, builds: any[], token?: string) => {
  const res = await axios.put(
    `${API_BASE}/inventory/${vendorId}/bulk-update/`,
    builds,
    { headers: getAuthHeaders(token) }
  );
  return res.data;
};

// Upload inventory via Excel/CSV
export const uploadInventory = async (vendorId: number, file: File, token?: string) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${API_BASE}/inventory/${vendorId}/upload/`, formData, {
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Log every request (useful for debugging in DevTools / console)
axios.interceptors.request.use((request) => {
    console.log("➡️ API Request:");
    console.log("URL     :", request.url);
    console.log("Method  :", request.method?.toUpperCase());
    console.log("Headers :", request.headers);
    console.log("Data    :", request.data);
    return request;
}, (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
});

// Log every response
axios.interceptors.response.use((response) => {
    console.log("✅ API Response:");
    console.log("URL     :", response.config.url);
    console.log("Status  :", response.status);
    console.log("Data    :", response.data);
    return response;
}, (error) => {
    console.error("❌ API Response Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
});
