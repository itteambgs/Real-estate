import React, { useEffect, useState } from "react";
import { getProperties, addProperty, updateProperty, deleteProperty, getDropdownOptions } from "helpers/apiHelper";
import { Table, Typography, Spin, Alert, Button, Modal, Form, Input, message } from "antd";
import "antd/dist/reset.css";
import ListProperty from "./ListProperty";
import CreateProperty from "./CreateProperty";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({});  // Define formData state
  const [dropdownOptions, setDropdownOptions] = useState({});  // Define state for dropdown options

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProperties();
        setProperties(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    // Fetch dropdown options for select fields
    const fetchDropdownOptions = async () => {
      try {
        const options = await getDropdownOptions();
        setDropdownOptions(options);
      } catch (err) {
        setError("Failed to fetch dropdown options");
      }
    };
    fetchDropdownOptions();
  }, []);

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentProperty(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setCurrentProperty(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const response = await deleteProperty(id);
    if (response.success) {
      setProperties((prev) => prev.filter((item) => item.id !== id));
      message.success("Property deleted successfully");
    } else {
      message.error(response.error || "Failed to delete property");
    }
  };

  const handleFormSubmit = async (values) => {
    if (isEditing) {
      const updatedProperty = { ...currentProperty, ...values };
      const response = await updateProperty(currentProperty.id, updatedProperty);

      if (response.success) {
        setProperties((prev) =>
          prev.map((item) =>
            item.id === currentProperty.id ? response.data : item
          )
        );
        message.success("Property updated successfully");
      } else {
        message.error(response.error || "Failed to update property");
      }
    } else {
      const response = await addProperty(values);
      if (response.success) {
        setProperties([...properties, response.data]);
        message.success("Property added successfully");
      } else {
        message.error(response.error || "Failed to add property");
      }
    }

    setIsModalOpen(false);
  };

  const columns = Object.keys(properties[0] || {}).map((key) => ({
    title: key.replace(/_/g, " ").toUpperCase(),
    dataIndex: key,
    key: key,
    render: (text) => (text ? text.toString() : "-"),
  }));

  columns.push({
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <>
        <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
        <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
      </>
    ),
  });

  return (
    <div>
      <h1>Properties</h1>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Property
      </Button>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={properties}
          columns={columns}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      )}

      <Modal
        title={isEditing ? "Edit Property" : "Add Property"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          {Object.keys(properties[0] || {})
            .filter((key) => !["id", "added_by", "last_edited_by"].includes(key)) // Exclude these fields
            .map((key) => (
              <Form.Item
                key={key}
                name={key}
                label={key.replace(/_/g, " ").toUpperCase()}
                rules={[{ required: key === "property_name", message: "Property Name is required" }]}
              >
                <Input />
              </Form.Item>
            ))}
        </Form>
      </Modal>
      <ListProperty />
      <CreateProperty
        formData={formData}
        setFormData={setFormData}  // Pass setFormData
        handleSubmit={handleFormSubmit}  // Pass submit handler
        loading={loading}
        error={error}
        dropdownOptions={dropdownOptions} // Pass dropdown options
      />
    </div>
  );
};

export default Properties;
