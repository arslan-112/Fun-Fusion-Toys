import React, { useEffect, useState } from "react";
import { Button, message, Space, Upload, Input, Modal, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import DataTable from "../../components/Table";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../../api/products";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEditProduct = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("description", values.description);
      formData.append("quantity", values.quantity);  // Add quantity
      if (file) {
        formData.append("image", file); // Include the uploaded file
      }

      if (currentProduct) {
        await updateProduct(currentProduct._id, formData);
        message.success("Product updated successfully");
      } else {
        await addProduct(formData);
        message.success("Product added successfully");
      }

      fetchProducts();
      setModalVisible(false);
      setCurrentProduct(null);
      setFile(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add/edit product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      message.success("Product deleted successfully");
      fetchProducts();
    } catch {
      message.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" }, // Display quantity in table
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={`http://localhost:5000/uploads/${image}`} // Use correct path to access the image
          alt="product"
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => { 
            setCurrentProduct(record); 
            form.setFieldsValue(record);
            setModalVisible(true); 
          }}>Edit</Button>
          <Button danger onClick={() => handleDeleteProduct(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => { 
          setModalVisible(true); 
          setCurrentProduct(null); 
          form.resetFields(); 
        }}
        style={{ marginBottom: "16px" }}
      >
        Add Product
      </Button>
      <DataTable columns={columns} data={products} loading={loading} />
      <Modal
        title={currentProduct ? "Edit Product" : "Add Product"}
        visible={modalVisible}
        onCancel={() => { 
          setModalVisible(false); 
          setFile(null); 
        }}
        onOk={handleAddEditProduct}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
          >
            <Input placeholder="Enter product price" type="number" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter the product quantity" }]}
          >
            <Input placeholder="Enter product quantity" type="number" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter product description" />
          </Form.Item>
          <Form.Item label="Product Image">
            <Upload
              accept="image/*"
              beforeUpload={(file) => {
                setFile(file); // Save the file for upload
                return false; // Prevent automatic upload
              }}
              fileList={file ? [file] : []} // Display file in the UI
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Products;
