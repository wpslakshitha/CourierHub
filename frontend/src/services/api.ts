import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Example API calls
export const fetchServerStatus = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
