import React, { useEffect, useState } from "react";
import { Button, message, Modal, Form, Input, Space } from "antd";
import DataTable from "../../components/Table";
import { getUsers, addUser, updateUser, deleteUser } from "../../api/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEditUser = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (currentUser) {
        // Update existing user
        await updateUser(currentUser._id, values);
        message.success("User updated successfully");
      } else {
        // Add new user
        await addUser(values);
        message.success("User added successfully");
      }
      fetchUsers();
      setModalVisible(false);
      setCurrentUser(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add/edit user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setLoading(true);
    try {
      await deleteUser(id);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    form.setFieldsValue(user); // Set form values for editing
    setModalVisible(true);
  };

  const openAddModal = () => {
    setCurrentUser(null);
    form.resetFields(); // Reset form fields for adding a new user
    setModalVisible(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEditModal(record)}>Edit</Button>
          <Button danger onClick={() => handleDeleteUser(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={openAddModal}
        style={{ marginBottom: "16px" }}
      >
        Add User
      </Button>
      <DataTable columns={columns} data={users} loading={loading} />
      
      {/* Modal for Adding/Editing Users */}
      <Modal
        visible={modalVisible}
        title={currentUser ? "Edit User" : "Add User"}
        onCancel={() => setModalVisible(false)}
        onOk={handleAddEditUser}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" initialValues={currentUser || {}}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please input first name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please input last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input />
          </Form.Item>

          {/* Password Field */}
          {!currentUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input password!" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          {currentUser && (
            <Form.Item
              name="password"
              label="Password (Leave empty to keep current)"
            >
              <Input.Password disabled />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default Users;
