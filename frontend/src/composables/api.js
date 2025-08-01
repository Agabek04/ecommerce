import axios from "axios";

const API_URL = "http://localhost:3000";
const api = axios.create({
  baseURL: "http://localhost:3000"
});

export default api