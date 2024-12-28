import React, { useContext, useState } from "react";
import { Form, Input, Button } from "antd";
import { login } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { login: setAuthToken } = useContext(AuthContext);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await login(values);
      console.log(response.user)

      const {token, user} = response;
      setAuthToken(token, user);
      navigate("/dashboard", {replace : true});
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={handleLogin} style={{width:"50%",margin:"0 auto",verticalAlign:"centre",paddingTop:"15%"}}>
      <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
