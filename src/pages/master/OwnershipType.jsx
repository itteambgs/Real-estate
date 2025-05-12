import React, { useEffect, useState } from "react";
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
import {
  getownership,
  addOwnershipType,
  updateOwnershipType,
  deleteOwnershipType,
} from "helpers/apiHelper";

const { Search } = Input;

const OwnershipType = () => {
  const [ownershipTypes, setOwnershipTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOwnership, setCurrentOwnership] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    fetchOwnershipTypes();
  }, [searchTerm]);

  const fetchOwnershipTypes = async () => {
    setLoading(true);
    try {
      const data = await getownership();
      const results = Array.isArray(data.results) ? data.results : [];

      const filtered = results.filter((item) =>
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ownership_type.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setOwnershipTypes(filtered);
    } catch (err) {
      setError("Failed to fetch ownership types");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentOwnership(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setCurrentOwnership(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteOwnershipType(id);
      setOwnershipTypes((prev) => prev.filter((item) => item.id !== id));
      message.success("Deleted successfully");
    } catch {
      message.error("Failed to delete ownership type");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRowKeys.length) return;
    if (!window.confirm("Delete selected ownership types?")) return;
    await Promise.all(selectedRowKeys.map((id) => deleteOwnershipType(id)));
    setSelectedRowKeys([]);
    fetchOwnershipTypes();
    message.success("Deleted selected items");
  };

  const handleFormSubmit = async (values) => {
    if (isEditing) {
      try {
        const res = await updateOwnershipType(currentOwnership.id, values);
        setOwnershipTypes((prev) =>
          prev.map((item) => (item.id === currentOwnership.id ? res.data : item))
        );
        message.success("Updated successfully");
      } catch {
        message.error("Update failed");
      }
    } else {
      try {
        const res = await addOwnershipType(values);
        setOwnershipTypes([...ownershipTypes, res.data]);
        message.success("Added successfully");
      } catch {
        message.error("Add failed");
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
    { title: "Code", dataIndex: "code", key: "code", width: "30%" },
    { title: "Ownership Type", dataIndex: "ownership_type", key: "ownership_type", width: "30%" },
    {
      title: "Actions",
      key: "actions",
      width: "30%",
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
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Ownership Types</Typography.Title>

      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Search
            placeholder="Search by Code or Ownership Type"
            allowClear
            enterButton
            onSearch={(value) => setSearchTerm(value)}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 550 }}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={handleAdd} style={{ marginRight: 8 }}>
            Add Ownership Type
          </Button>
          <Button
            danger
            onClick={handleBulkDelete}
            disabled={!selectedRowKeys.length}
          >
            Delete Selected
          </Button>
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
          dataSource={ownershipTypes}
          columns={columns}
          rowKey="id"
        />
      )}

      <Modal
        title={isEditing ? "Edit Ownership Type" : "Add Ownership Type"}
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
            name="ownership_type"
            label="Ownership Type"
            rules={[{ required: true, message: "Please enter ownership type" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OwnershipType;
