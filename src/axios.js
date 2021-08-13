import axios from "axios";

let headers = {
  "Content-Type": "application/json",
};

const axiosInstance = axios.create({
  headers,
  timeout: 60000,
  baseURL: `${process.env.REACT_APP_API_HOST}/api/v1/`,
});

export default axiosInstance;
