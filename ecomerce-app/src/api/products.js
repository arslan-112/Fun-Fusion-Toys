import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/products`;

const getToken = () => {
  return localStorage.getItem("token");
};

const createAxiosInstance = () => {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  return axios.create({
    baseURL: API_URL,
    headers,
  });
};

export const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const addProduct = async (product) => {
  const axiosInstance = createAxiosInstance();
  const response = await axiosInstance.post(API_URL, product);
  return response.data.data;
};

export const updateProduct = async (id, product) => {
  const axiosInstance = createAxiosInstance();
  const response = await axiosInstance.put(`${API_URL}/${id}`, product);
  return response.data.data;
};

export const deleteProduct = async (id) => {
  const axiosInstance = createAxiosInstance();
  const response = await axiosInstance.delete(`${API_URL}/${id}`);
  return response.data.data;
};
