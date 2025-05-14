import React, { useEffect, useState } from "react";
import {
  getDocumentTypes,
  addDocumentType,
  updateDocumentType,
  deleteDocumentType,
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

const DocumentType = () => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    fetchDocumentTypes();
  }, [searchTerm]);

  const fetchDocumentTypes = async () => {
    setLoading(true);
    try {
      const data = await getDocumentTypes();
      const results = Array.isArray(data.results) ? data.results : [];
      const filtered = results.filter((item) =>
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.document_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDocumentTypes(filtered);
    } catch (err) {
      setError("Failed to fetch Document Types");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentDoc(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setCurrentDoc(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocumentType(id);
      setDocumentTypes((prev) => prev.filter((item) => item.id !== id));
      message.success("Deleted successfully");
    } catch {
      message.error("Failed to delete document type");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRowKeys.length) return;
    if (!window.confirm("Delete selected Document Types?")) return;
    await Promise.all(selectedRowKeys.map((id) => deleteDocumentType(id)));
    setSelectedRowKeys([]);
    fetchDocumentTypes();
    message.success("Deleted selected items");
  };

  const handleFormSubmit = async (values) => {
    if (isEditing) {
      const res = await updateDocumentType(currentDoc.id, values);
      if (res.success) {
        setDocumentTypes((prev) =>
          prev.map((item) => (item.id === currentDoc.id ? res.data : item))
        );
        message.success("Updated successfully");
      } else {
        message.error(`Update failed: ${res.error}`);
      }
    } else {
      const res = await addDocumentType(values);
      if (res.success) {
        setDocumentTypes([...documentTypes, res.data]);
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
    { title: "Code", dataIndex: "code", key: "code", width: "30%" },
    { title: "Document Type", dataIndex: "document_type", key: "document_type", width: "30%" },
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
      width: "30%",
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Document Types</Typography.Title>

      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Search
            placeholder="Search by Code or Document Type"
            allowClear
            enterButton
            onSearch={(value) => setSearchTerm(value)}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 550 }}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={handleAdd} style={{ marginRight: 8 }}>
            Add Document Type
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
          dataSource={documentTypes}
          columns={columns}
          rowKey="id"
        />
      )}

      <Modal
        title={isEditing ? "Edit Document Type" : "Add Document Type"}
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
            name="document_type"
            label="Document Type"
            rules={[{ required: true, message: "Please enter document type" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DocumentType;