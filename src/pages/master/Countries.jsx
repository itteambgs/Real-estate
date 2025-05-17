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
  Row,
  Col,
  Popconfirm,
} from "antd";
import "antd/dist/reset.css";

const { Search } = Input;

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    fetchCountries();
  }, [searchTerm]);

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCountries();
      const allCountries = Array.isArray(data.results) ? data.results : [];
      const filtered = allCountries.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCountries(filtered);
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentCountry(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setCurrentCountry(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this country?")) return;
  //   const response = await deleteCountries(id);
  //   if (response.success) {
  //     setCountries((prev) => prev.filter((item) => item.id !== id));
  //     message.success("Country deleted successfully");
  //   } else {
  //     message.error(`Delete failed: ${response.error}`);
  //   }
  // };


    const handleDelete = async (id) => {
        try {
          await deleteCountries(id);
          setCountries((prev) => prev.filter((item) => item.id !== id));
          message.success("Deleted successfully");
        } catch {
          message.error("Failed to delete ownership type");
        }
      };



  const handleBulkDelete = async () => {
    if (!selectedRowKeys.length) return;
    if (!window.confirm("Delete selected countries?")) return;
    await Promise.all(selectedRowKeys.map((id) => deleteCountries(id)));
    setSelectedRowKeys([]);
    fetchCountries();
    message.success("Selected countries deleted.");
  };

  const handleFormSubmit = async (values) => {
    if (isEditing) {
      const response = await updateCountries(currentCountry.id, values);
      if (response.success) {
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
      const response = await addCountries(values);
      if (response.success) {
        setCountries([...countries, response.data]);
        message.success("Country added successfully");
      } else {
        message.error(`Add failed: ${response.error}`);
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
    { title: "Code", dataIndex: "code", key: "code", width: '30%' },
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
      <Typography.Title level={2}>Countries</Typography.Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
  {/* Search Field */}
  <Col xs={24} sm={24} md={16}>
    <Search
      placeholder="Search by name or code"
      allowClear
      enterButton
      onSearch={(value) => setSearchTerm(value)}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ width: '100%' }}
    />
  </Col>

  {/* Buttons */}
  <Col xs={24} sm={24} md={8}>
    <Row gutter={[8, 8]} justify="end">
      <Col xs={24} sm={12}>
        <Button
          type="primary"
          block
          onClick={handleAdd}
        >
          Add Country
        </Button>
      </Col>
      <Col xs={24} sm={12}>
        <Button
          danger
          block
          onClick={handleBulkDelete}
          disabled={!selectedRowKeys.length}
        >
          Delete Selected
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
          dataSource={countries}
          columns={columns}
          rowKey="id"
          scroll={{ x: '100%' }}
        />
      )}

      <Modal
        title={isEditing ? "Edit Country" : "Add Country"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
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
