import axios from "axios";
import { API_BASE_URL } from "@/config/api"; // make sure this file exists

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- AUTH ----------------
export const getProfile = async (token: string) => {
  try {
    const res = await api.get("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.user;
  } catch (err: any) {
    console.error("Profile Load Error:", err.response?.data || err.message);
    throw err;
  }
};

// You can add other common APIs here later (login, register, etc.)
export default api;
