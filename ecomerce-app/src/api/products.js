import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

// Utility function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem("token"); // Replace 'token' with the actual key used in localStorage
};

// Function to create an axios instance with or without the Authorization header
const createAxiosInstance = () => {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  return axios.create({
    baseURL: API_URL,
    headers,
  });
};

export const getProducts = async () => {
  const response = await axios.get(API_URL); // No token is added here for GET requests
  return response.data.data;
};

export const addProduct = async (product) => {
  const axiosInstance = createAxiosInstance(); // Creating an axios instance with token for POST requests
  const response = await axiosInstance.post(API_URL, product);
  return response.data.data;
};

export const updateProduct = async (id, product) => {
  const axiosInstance = createAxiosInstance(); // Creating an axios instance with token for PUT requests
  const response = await axiosInstance.put(`${API_URL}/${id}`, product);
  return response.data.data;
};

export const deleteProduct = async (id) => {
  const axiosInstance = createAxiosInstance(); // Creating an axios instance with token for DELETE requests
  const response = await axiosInstance.delete(`${API_URL}/${id}`);
  return response.data.data;
};
