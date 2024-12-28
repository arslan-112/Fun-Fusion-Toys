import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

// Fetch orders
export const getOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

// Update order status
export const updateOrder = async (orderId, updatedData) => {
  const response = await axios.put(`${API_URL}/${orderId}/status`, updatedData);
  return response.data; // return the updated order data
};
