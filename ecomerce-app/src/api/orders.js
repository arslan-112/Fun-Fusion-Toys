import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/orders`;

export const getOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const updateOrder = async (orderId, updatedData) => {
  const response = await axios.put(`${API_URL}/${orderId}/status`, updatedData);
  return response.data;
};
