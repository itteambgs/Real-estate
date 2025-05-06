import React, { useEffect, useState } from "react";
import {
  getCountries,
  addCountries,
  updateCountries,
  deleteCountries,
} from "helpers/apiHelper";
import {
  Table,
  Typography,
  Spin,
  Alert,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import "antd/dist/reset.css";

const Countries = () => {
  // State variables
  const [countries, setCountries] = useState([]); // stores country list
  const [loading, setLoading] = useState(true); // loading indicator
  const [error, setError] = useState(null); // error message
  const [isModalOpen, setIsModalOpen] = useState(false); // modal visibility
  const [isEditing, setIsEditing] = useState(false); // track whether we are editing
  const [currentCountry, setCurrentCountry] = useState(null); // store selected country for editing
  const [form] = Form.useForm(); // AntD form instance

  // Fetch country list on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCountries(); // Call API to get countries
        setCountries(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to fetch countries");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Open modal for adding a new country
  const handleAdd = () => {
    setIsEditing(false); // make sure we're in add mode
    setCurrentCountry(null);
    form.resetFields(); // clear form
    setIsModalOpen(true); // open modal
  };

  // Open modal for editing an existing country
  const handleEdit = (record) => {
    setIsEditing(true);
    setCurrentCountry(record); // store selected country
    form.setFieldsValue(record); // populate form with country data
    setIsModalOpen(true);
  };

  // Delete a country after confirmation
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this country?");
    if (!confirm) return;

    const response = await deleteCountries(id); // Call delete API
    if (response.success) {
      setCountries((prev) => prev.filter((item) => item.id !== id)); // remove from list
      message.success("Country deleted successfully");
    } else {
      message.error(`Delete failed: ${response.error}`);
    }
  };

  // Handle Add/Edit form submission
  const handleFormSubmit = async (values) => {
    if (isEditing) {
      // Update country
      const response = await updateCountries(currentCountry.id, values);
      if (response.success) {
        // update item in list
        setCountries((prev) =>
          prev.map((item) =>
            item.id === currentCountry.id ? response.data : item
          )
        );
        message.success("Country updated successfully");
      } else {
        message.error(`Update failed: ${response.error}`);
      }
    } else {
      // Add new country
      const response = await addCountries(values);
      if (response.success) {
        setCountries([...countries, response.data]); // append to list
        message.success("Country added successfully");
      } else {
        message.error(`Add failed: ${response.error}`);
      }
    }
    setIsModalOpen(false); // close modal
  };

  // Table columns definition
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: '20%' },
    { title: "Name", dataIndex: "name", key: "name", width: '27.30%' },
    { title: "Code", dataIndex: "code", key: "code", width: '27.30%' },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </>
      ),
      width: '25%',
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Countries</Typography.Title>

      {/* Add Button */}
    {/* Add Button - Now aligned left */}
    <div style={{ textAlign: "right", marginTop: "-40px", marginBottom: 42 }}>
  <Button type="primary" onClick={handleAdd}>
    Add Country
  </Button>
</div>

      {/* Error Message */}
      {error && <Alert message={error} type="error" showIcon />}

      {/* Loading Spinner or Table */}
      {loading ? (
  <div style={{ textAlign: "right", marginBottom: 16 }}>
    <Spin size="large" />
  </div>
) : (
  <Table dataSource={countries} columns={columns} rowKey="id" scroll={{ x: '100%' }} />
)}

      {/* Modal for Add/Edit Country */}
      <Modal
        title={isEditing ? "Edit Country" : "Add Country"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()} // triggers form submit
        okText={isEditing ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Country Name"
            rules={[{ required: true, message: "Please enter country name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Country Code"
            rules={[{ required: true, message: "Please enter country code" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Countries;
