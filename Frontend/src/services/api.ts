import client from "../api/client"; // centralized Axios instance

// 🔹 Helper to get auth headers
const getAuthHeaders = (token?: string) => {
  const accessToken = token ?? localStorage.getItem("access_token");
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

// ------------------- Shops -------------------

// Register a new shop/vendor
export const registerShop = async (shopData: any, token?: string) => {
  const res = await client.post("/shops/", shopData, {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

// Get all shops
export const getShops = async (token?: string) => {
  const res = await client.get("/shops/", {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

// ------------------- Inventory -------------------

// Fetch inventory for a vendor/shop
export const getInventory = async (vendorId: number, token?: string) => {
  const res = await client.get(`/inventory/${vendorId}/`, {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

// Bulk update inventory
export const bulkUpdateInventory = async (vendorId: number, builds: any[], token?: string) => {
  const res = await client.put(
    `/inventory/${vendorId}/bulk-update/`,
    builds,
    { headers: getAuthHeaders(token) }
  );
  return res.data;
};

// Upload inventory via Excel/CSV
export const uploadInventory = async (vendorId: number, file: File, token?: string) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await client.post(`/inventory/${vendorId}/upload/`, formData, {
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};