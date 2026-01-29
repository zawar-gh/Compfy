// auth.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Auth endpoints
export const signup = async (
  username: string,
  email: string,
  password: string,
  role: "customer"
) => {
  const res = await axios.post(
    `${API_BASE_URL}auth/signup/`,
    { username, email, password, role }
  );
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await axios.post(
    `${API_BASE_URL}auth/login/`,
    { email, password }
  );
  return res.data; // { access, refresh, user }
};

export const deleteAccount = async (token: string) => {
  const res = await axios.delete(
    `${API_BASE_URL}users/delete/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
