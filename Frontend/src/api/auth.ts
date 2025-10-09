//auth.ts
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth/";

// Adjust the endpoint names to match Django URLs
export const signup = async (username: string, email: string, password: string, role: 'customer') => {
  // Example if backend uses /register/ and expects email+password+name
  const res = await axios.post(`${API_URL}signup/`, { username, email, password, role });
  return res.data;
};

export const login = async (email: string, password: string) => {
  // Example if backend expects email and password
  const res = await axios.post(`${API_URL}login/`, { email, password });
  return res.data; // { access, refresh, user, vendor? }
};
export async function deleteAccount(token: string) {
  const res = await fetch("http://127.0.0.1:8000/api/users/delete/", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete account");
  return true;
};
