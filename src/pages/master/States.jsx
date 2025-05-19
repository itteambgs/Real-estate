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
  Select,
  Pagination,
  Row,
  Col,
  Popconfirm,
} from "antd";
import {
  getStates,
  addStates,
  updateStates,
  deleteStates,
  getCountries,
} from "helpers/apiHelper";

const { Option } = Select;
const { Search } = Input;

const States = () => {
  const [states, setStates] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const pageSize = 10;

  useEffect(() => {
    fetchCountries();
    fetchAllStates();
  }, []);

  useEffect(() => {
    filterStates();
  }, [searchTerm, currentPage, allStates, countries]);

  const fetchCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res.results || []);
    } catch (err) {
      message.error("Failed to load countries");
    }
  };

  const fetchAllStates = async () => {
    setLoading(true);
    try {
      let page = 1;
      let results = [];
      let hasMore = true;
      while (hasMore) {
        const res = await getStates(`?page=${page}`);
        results = [...results, ...(res.results || [])];
        if (!res.next) {
          hasMore = false;
        } else {
          page++;
        }
      }
      setAllStates(results);
    } catch {
      setError("Failed to fetch states");
    } finally {
      setLoading(false);
    }
  };

  const filterStates = () => {
    let filtered = [...allStates];
    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const countryName = countries.find((c) => c.id === item.country)?.name || "";
        return (
          item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          countryName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setStates(filtered.slice(start, end));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    form.resetFields();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setCurrentState(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure to delete this state?")) return;
  //   await deleteStates(id);
  //   message.success("Deleted");
  //   fetchAllStates();
  // };

    const handleDelete = async (id) => {
      try {
        await deleteStates(id);
        message.success("Deleted successfully");
        fetchAllStates();
      } catch {
        message.error("Failed to delete States");
      }
    };

  const handleBulkDelete = async () => {
    if (!window.confirm("Delete selected items?")) return;
    await Promise.all(selectedRowKeys.map((id) => deleteStates(id)));
    setSelectedRowKeys([]);
    fetchAllStates();
  };

  const handleFormSubmit = async (values) => {
    const data = {
      state: values.state,
      code: values.code,
      country: values.country,
    };

    try {
      if (isEditing) {
        await updateStates(currentState.id, data);
        message.success("State updated");
      } else {
        await addStates(data);
        message.success("State added");
      }
      setIsModalOpen(false);
      fetchAllStates();
    } catch (err) {
      message.error("Failed to save");
    }
  };

  const columns = [
    {
      title: "ID",
      key: "index",
      width: "10%",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "State",
      dataIndex: "state",
      width: 200,
      align: "left",
    },
    {
      title: "Code",
      dataIndex: "code",
      width: 150,
      align: "center",
    },
    {
      title: "Country",
      dataIndex: "country",
      render: (id) => countries.find((c) => c.id === id)?.name || "N/A",
      width: 200,
      align: "center",
    },
    {
      title: "Actions",
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
      align: "center",
    },
  ];

  const totalFiltered = allStates.filter((item) => {
    const countryName = countries.find((c) => c.id === item.country)?.name || "";
    return (
      item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      countryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }).length;

  return (
    <div>
      <Typography.Title level={2}>States</Typography.Title>

 <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 20 }}>
  {/* Search Field */}
  <Col xs={24} sm={24} md={16}>
    <Search
      placeholder="Search by State, Code, or Country"
      allowClear
      enterButton
      onSearch={(value) => setSearchTerm(value)}
      onChange={(e) => {
        setCurrentPage(1);
        setSearchTerm(e.target.value);
      }}
      style={{ width: '100%' }}
    />
  </Col>

  {/* Action Buttons */}
    <Col xs={24} sm={24} md={8}>
    <Row gutter={[8, 8]} justify="end">
      <Col xs={24} sm={12}>
        <Button type="primary" block onClick={handleAdd}>
          Add State
        </Button>
      </Col>
      <Col xs={24} sm={12}>
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


      {error && <Alert type="error" message={error} />}
      {loading ? (
        <Spin />
      ) : (
        <>
          <Table
          
          scroll={{ x: "max-content" }}
            rowKey="id"
            columns={columns}
            dataSource={states}
            pagination={false}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
          />
          <Row justify="end" style={{ marginTop: 16 }}>
            <Col>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalFiltered}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </Col>
          </Row>
        </>
      )}

      <Modal
        title={isEditing ? "Edit State" : "Add State"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={isEditing ? "Update" : "Add"}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item name="country" label="Country" rules={[{ required: true }]}>
            <Select placeholder="Select country">
              {countries.map((country) => (
                <Option key={country.id} value={country.id}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="state" label="State Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="State Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default States;