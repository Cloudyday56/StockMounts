import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "/api" : "https://backend-6z9h.onrender.com/api";
// Change "/api" to "http://localhost:5001/api" for non-docker development

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default api;