import axios from "axios";

let headers = {
  "Content-Type": "application/json",
};

const axiosInstance = axios.create({
  headers,
  timeout: 60000,
  baseURL: "http://localhost:8000/api/v1/",
});

export default axiosInstance;
