import React from "react";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  // Retrieve the user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role || "Admin"; // Default to "Admin" if no user or role is found

  const onLogout = () => {
    // Clear token and user from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login page
    window.location.reload();
    navigate("/login", { replace: true });
  };

  // Define menu items
  const allMenuItems = [
    {
      key: "1",
      label: <Link to="/dashboard/users">Users</Link>,
    },
    {
      key: "2",
      label: <Link to="/dashboard/products">Products</Link>,
    },
    {
      key: "3",
      label: <Link to="/dashboard/orders">Orders</Link>,
    },
    {
      key: "logout",
      label: <span onClick={onLogout}>Logout</span>,
      style: { position: "absolute", bottom: 0, width: "100%" },
    },
  ];

  // Filter menu items based on role
  const filteredMenuItems =
    userRole === "Logistics"
      ? allMenuItems.filter((item) => item.key !== "1" && item.key !== "2")
      : allMenuItems;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div className="logo" style={{ color: "white", padding: "20px", textAlign: "center" }}>
          {userRole} Panel
        </div>
        <Menu theme="dark" mode="inline" items={filteredMenuItems} />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "16px" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
