import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/users`;

export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const addUser = async (user) => {
  const response = await axios.post(API_URL, user);
  return response.data.data;
};

export const updateUser = async (id, user) => {
  const response = await axios.put(`${API_URL}/${id}`, user);
  return response.data.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data.data;
};
