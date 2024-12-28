import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const userLogin = async (credentials) => {
  const response = await axios.post("http://localhost:5000/api/auth/login", credentials);
  return response.data.data;
};

export const userSignUp = async (userDetails) => {
  const response = await axios.post(`${API_URL}/Customer`, userDetails);
  return response.data.data;
};

