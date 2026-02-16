// src/api.ts
import client from "../api/client"; // ✅ Use the centralized instance

// ------------------- Shops / Vendors -------------------

// Register a new shop/vendor
export const registerShop = async (shopData: any) => {
  // client already handles the BaseURL and Auth Headers!
  const res = await client.post("/vendor/", shopData); 
  return res.data;
};

// Get all shops
export const getShops = async () => {
  const res = await client.get("/vendor/");
  return res.data;
};

// ------------------- Inventory -------------------

// Fetch inventory for a vendor/shop
export const getInventory = async (vendorId: number) => {
  const res = await client.get(`/inventory/${vendorId}/`);
  return res.data;
};

// Bulk update inventory
export const bulkUpdateInventory = async (vendorId: number, builds: any[]) => {
  const res = await client.put(
    `/inventory/${vendorId}/bulk-update/`,
    builds
  );
  return res.data;
};

// Upload inventory via Excel/CSV
export const uploadInventory = async (vendorId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await client.post(`/inventory/${vendorId}/upload/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// src/services/api.ts

export const deleteBuild = async (vendorId: number, buildId: string | number) => {
  // ✅ No localhost here! It uses the 'client' instance we configured.
  const res = await client.delete(`/inventory/vendor/${vendorId}/build/${buildId}/delete/`);
  return res.data;
};