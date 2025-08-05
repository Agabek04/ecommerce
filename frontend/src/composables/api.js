import axios from "axios";
// "https://ecommerce-2-84fp.onrender.com"
const api = axios.create({
  baseURL: "https://ecommerce-2-84fp.onrender.com"
});

export default api