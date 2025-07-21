import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api/v1", // ✅ just once!
  withCredentials: true
});

export default api;
