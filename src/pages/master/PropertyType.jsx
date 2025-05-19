import React, { useEffect, useState } from "react";
import {
  getPropertyTypes,
  addPropertyType,
  updatePropertyType,
  deletePropertyType,
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
  Row,
  Col,
  Popconfirm,
} from "antd";
import "antd/dist/reset.css";

const { Search } = Input;

const PropertyType = () => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    fetchPropertyTypes();
  }, [searchTerm]);

  const fetchPropertyTypes = async () => {
    setLoading(true);
    try {
      const data = await getPropertyTypes();
      const results = Array.isArray(data.results) ? data.results : [];
      const filtered = results.filter((item) =>
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPropertyTypes(filtered);
    } catch (err) {
      setError("Failed to fetch Property Types");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setCurrentItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deletePropertyType(id);
      setPropertyTypes((prev) => prev.filter((item) => item.id !== id));
      message.success("Deleted successfully");
    } catch {
      message.error("Failed to delete property type");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRowKeys.length) return;
    if (!window.confirm("Delete selected Property Types?")) return;
    await Promise.all(selectedRowKeys.map((id) => deletePropertyType(id)));
    setSelectedRowKeys([]);
    fetchPropertyTypes();
    message.success("Deleted selected items");
  };

  const handleFormSubmit = async (values) => {
    if (isEditing) {
      const res = await updatePropertyType(currentItem.id, values);
      if (res.success) {
        setPropertyTypes((prev) =>
          prev.map((item) => (item.id === currentItem.id ? res.data : item))
        );
        message.success("Updated successfully");
      } else {
        message.error(`Update failed: ${res.error}`);
      }
    } else {
      const res = await addPropertyType(values);
      if (res.success) {
        setPropertyTypes([...propertyTypes, res.data]);
        message.success("Added successfully");
      } else {
        message.error(`Add failed: ${res.error}`);
      }
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "ID",
      key: "index",
      width: "10%",
      render: (text, record, index) => index + 1,
      
    },
    { title: "Code", dataIndex: "code", key: "code", width: 200, },
    { title: "Property Type", dataIndex: "type_name", key: "type_name", width: 200, },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
      width: 200,
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Property Types</Typography.Title>

       <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
      <Col xs={24} sm={24} md={16}>
    <Search
      placeholder="Search by Code or Property Type"
      allowClear
      enterButton
      onSearch={(value) => setSearchTerm(value)}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ width: '100%' }}
    />
  </Col>

  {/* Buttons - stacked on small screens, inline on medium+ */}
  <Col xs={24} sm={24} md={8}>
     <Row gutter={[8, 8]} justify="end">
       <Col xs={24} sm={12} md={12}>
        <Button
          type="primary"
          block
          onClick={handleAdd}
        >
          Add Property Type
        </Button>
      </Col>
      <Col xs={24} sm={12} md={12}>
        <Button
          danger
          block
          onClick={handleBulkDelete}
          disabled={!selectedRowKeys.length}
        >
          Delete Selected ({selectedRowKeys.length})
        </Button>
      </Col>
    </Row>
  </Col>
</Row>


      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          dataSource={propertyTypes}
          columns={columns}
          rowKey="id"
           scroll={{ x: "max-content" }}
          pagination={{ pageSize: 10 }}
          
        />
      )}

      <Modal
        title={isEditing ? "Edit Property Type" : "Add Property Type"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={isEditing ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: "Please enter code" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type_name"
            label="Type Name"
            rules={[{ required: true, message: "Please enter property type" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PropertyType;
