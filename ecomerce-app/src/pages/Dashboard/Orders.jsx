/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Tag,
  Space,
  Modal,
  Button,
  Form,
  Input as AntInput,
  notification,
  Select,
} from "antd";
import { getOrders, updateOrder } from "../../api/orders"; // Assume `updateOrder` is an API method for updating orders

const { Search } = Input;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [form] = Form.useForm();

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role || "Admin"; // Default to Admin

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response);
      setFilteredOrders(response);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (value) => {
    const filtered = orders.filter(
      (order) =>
        order.userDetails.firstName
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        order.userDetails.lastName
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        order.email.toLowerCase().includes(value.toLowerCase()) ||
        order.orderStatus?.toLowerCase().includes(value.toLowerCase()) // Add this line to filter by order status
    );
    setFilteredOrders(filtered);
  };

  const handleEdit = (order) => {
    setCurrentOrder(order);
    form.setFieldsValue({
      address: order.address,
      email: order.email,
      orderStatus: order.orderStatus,
      total: order.total,
    });
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = form.getFieldsValue();
      await updateOrder(currentOrder._id, values); // Update the order using the API
      notification.success({ message: "Order updated successfully!" });
      setIsModalOpen(false);
      fetchOrders(); // Refresh the orders
    } catch (error) {
      notification.error({ message: "Failed to update the order." });
      console.error(error);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Name",
      dataIndex: "userDetails",
      key: "name",
      render: (userDetails) =>
        `${userDetails.firstName} ${userDetails.lastName}`,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `$${total.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        const color = {
          pending: "gold",
          shipped: "blue",
          delivered: "green",
          canceled: "red",
        }[status];
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Products",
      key: "products",
      render: (record) => (
        <span>
          {record.products.map((product) => (
            <div
              key={product.productId._id}
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <img
                src={
                  `${import.meta.env.VITE_API_BASE_URL2}/uploads/` +
                  product.productId.image
                }
                alt={product.productId.name}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  marginRight: 10,
                }}
              />
              <span>
                {product.productId.name} x {product.quantity}
              </span>
            </div>
          ))}
        </span>
      ),
    },
    ...(userRole === "Logistics"
      ? [
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Button type="link" onClick={() => handleEdit(record)}>
                Edit
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Search
          placeholder="Search by name or email"
          enterButton="Search"
          onSearch={handleSearch}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Edit Order"
        visible={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="address" label="Address">
            <AntInput disabled />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <AntInput disabled />
          </Form.Item>
          <Form.Item
            name="orderStatus"
            label="Status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="shipped">Shipped</Select.Option>
              <Select.Option value="delivered">Delivered</Select.Option>
              <Select.Option value="canceled">Canceled</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="total" label="Total">
            <AntInput disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
