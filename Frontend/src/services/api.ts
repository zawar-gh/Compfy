// src/api.ts
import client from "../api/client"; // centralized Axios instance

// ------------------- Shops / Vendors -------------------

// Register a new shop/vendor
export const registerShop = async (shopData: any) => {
  const res = await client.post("/vendor/", shopData); 
  return res.data;
};

// Get logged-in vendor details
export const getVendor = async () => {
  const res = await client.get("/vendor/"); // returns 500 if no vendor, handle in frontend
  return res.data;
};

// ------------------- Vendor Builds -------------------

// Get all builds for logged-in vendor
export const getVendorBuilds = async () => {
  const res = await client.get("/builds/");
  return res.data;
};

// Create a new build
export const createVendorBuild = async (buildData: any) => {
  const res = await client.post("/builds/", buildData);
  return res.data;
};

// Delete a build
export const deleteVendorBuild = async (buildId: number | string) => {
  const res = await client.delete(`/builds/${buildId}/`);
  return res.data;
};

// ------------------- Inventory -------------------

// Fetch inventory for logged-in vendor
export const getInventory = async () => {
  const res = await client.get("/inventory/");
  return res.data;
};

// Bulk update inventory
export const bulkUpdateInventory = async (builds: any[]) => {
  const res = await client.put("/inventory/bulk-update/", builds);
  return res.data;
};

// Upload inventory via Excel/CSV
export const uploadInventory = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await client.post("/inventory/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};