import axios from "axios";
// "https://ecommerce-2-84fp.onrender.com"
const api = axios.create({
  baseURL: "http://localhost:3000"
});

export default api