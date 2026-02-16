import client from "../api/client"; 

// 🔹 Helper to get auth headers
const getAuthHeaders = (token?: string) => {
  const accessToken = token ?? localStorage.getItem("access_token");
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

// ------------------- Shops / Vendors -------------------

export const registerShop = async (shopData: any, token?: string) => {
  const res = await client.post("/shops/", shopData, {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

export const getShops = async (token?: string) => {
  const res = await client.get("/shops/", {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

export const getVendor = async (token?: string) => {
  const res = await client.get("/vendor/", {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

// ------------------- Vendor Builds -------------------

export const getVendorBuilds = async (token?: string) => {
  const res = await client.get("/builds/", {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

export const createVendorBuild = async (buildData: any, token?: string) => {
  const res = await client.post("/builds/", buildData, {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

/**
 * 🛠️ FIX: Adjusted signature to (vendorId, buildId) 
 * to match CheckInventoryPage.tsx:160 and 183
 */
export const deleteBuild = async (vendorId: number | string, buildId: number | string, token?: string) => {
  const res = await client.delete(`/builds/${buildId}/`, {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

// ------------------- Inventory -------------------

export const getInventory = async (vendorId: number, token?: string) => {
  const res = await client.get(`/inventory/${vendorId}/`, {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

export const bulkUpdateInventory = async (vendorId: number, builds: any[], token?: string) => {
  const res = await client.put(
    `/inventory/${vendorId}/bulk-update/`,
    builds,
    { headers: getAuthHeaders(token) }
  );
  return res.data;
};

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