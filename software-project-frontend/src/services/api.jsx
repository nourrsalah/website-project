// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  withCredentials: true, // 👈 important for cookies
});

export default api;
