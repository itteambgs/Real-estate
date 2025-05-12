import React, { useEffect, useState } from "react";
import {
  getBHKTypes,
  addBHKType,
  updateBHKType,
  deleteBHKType,
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

const BHKType = () => {
  const [bhkTypes, setBhkTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBHK, setCurrentBHK] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    fetchBHKTypes();
  }, [searchTerm]);

  const fetchBHKTypes = async () => {
    setLoading(true);
    try {
      const data = await getBHKTypes();
      const results = Array.isArray(data.results) ? data.results : [];
  
      const filtered = results.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bhk_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      setBhkTypes(filtered);
    } catch (err) {
      setError("Failed to fetch BHK Types");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentBHK(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setCurrentBHK(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Delete this BHK type?")) return;
  //   const res = await deleteBHKType(id);
  //   if (res.success) {
  //     setBhkTypes((prev) => prev.filter((item) => item.id !== id));
  //     message.success("Deleted successfully");
  //   } else {
  //     message.error(`Delete failed: ${res.error}`);
  //   }
  // };

  const handleDelete = async (id) => {
      try {
        await deleteBHKType(id);
        setBhkTypes((prev) => prev.filter((item) => item.id !== id));
        message.success("Deleted successfully");
      } catch {
        message.error("Failed to delete ownership type");
      }
    };

  const handleBulkDelete = async () => {
    if (!selectedRowKeys.length) return;
    if (!window.confirm("Delete selected BHK types?")) return;
    await Promise.all(selectedRowKeys.map((id) => deleteBHKType(id)));
    setSelectedRowKeys([]);
    fetchBHKTypes();
    message.success("Deleted selected items");
  };

  const handleFormSubmit = async (values) => {
    if (isEditing) {
      const res = await updateBHKType(currentBHK.id, values);
      if (res.success) {
        setBhkTypes((prev) =>
          prev.map((item) => (item.id === currentBHK.id ? res.data : item))
        );
        message.success("Updated successfully");
      } else {
        message.error(`Update failed: ${res.error}`);
      }
    } else {
      const res = await addBHKType(values);
      if (res.success) {
        setBhkTypes([...bhkTypes, res.data]);
        message.success("Added successfully");
      } else {
        message.error(`Add failed: ${res.error}`);
      }
    }
    setIsModalOpen(false);
  };

  const columns = [
    // { title: "ID", dataIndex: "id", key: "id", width: '20%' },
    {
      title: "ID",
      key: "index",
      width: "10%",
      render: (text, record, index) => index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name", width: '30%' },
    { title: "BHK Type", dataIndex: "bhk_type", key: "bhk_type", width: '30%'},
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
      width: '30%',
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>BHK Types</Typography.Title>

      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Search
            placeholder="Search by BHK Name or BHK Type	"
            allowClear
            enterButton
            onSearch={(value) => setSearchTerm(value)}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 550 }}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={handleAdd} style={{ marginRight: 8 }}>
            Add BHK Type
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
          dataSource={bhkTypes}
          columns={columns}
          rowKey="id"
        />
      )}

      <Modal
        title={isEditing ? "Edit BHK Type" : "Add BHK Type"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={isEditing ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bhk_type"
            label="BHK Type"
            rules={[{ required: true, message: "Please enter BHK type" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BHKType;
