import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // 👈 your backend base URL
  withCredentials: true, // if you're using cookies/tokens
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
