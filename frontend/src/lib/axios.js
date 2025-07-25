import axios from "axios";

// Change "/api" to "http://localhost:5001/api" for non-docker development
const BASE_URL = import.meta.env.MODE === "development" ? "/api" : "https://backend-6z9h.onrender.com/api";

const api = axios.create({
  baseURL: "/api",
});

export default api;