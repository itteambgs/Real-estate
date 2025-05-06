

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
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchStates();
  }, [currentPage, searchTerm, filterCountry]);

  const fetchCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res.results || []);
    } catch (err) {
      message.error("Failed to load countries");
    }
  };

  const fetchStates = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append("page", currentPage);
    if (searchTerm) params.append("search", searchTerm);
    if (filterCountry) params.append("country", filterCountry);

    try {
      const res = await getStates(`?${params.toString()}`);
      setStates(res.results || []);
      setTotalCount(res.count || 0);
    } catch (err) {
      setError("Failed to fetch states");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCountryChange = (value) => {
    setFilterCountry(value);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this state?")) return;
    await deleteStates(id);
    message.success("Deleted");
    fetchStates();
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Delete selected items?")) return;
    await Promise.all(selectedRowKeys.map((id) => deleteStates(id)));
    setSelectedRowKeys([]);
    fetchStates();
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
      fetchStates();
    } catch (err) {
      message.error("Failed to save");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,  // Setting a fixed width for the ID column
      align: "center",  // Aligning the text to the center
    },
    {
      title: "State",
      dataIndex: "state",
      width: 200,  // Adjust the width to fit the content
      align: "left",  // Align text to the left
    },
    {
      title: "Code",
      dataIndex: "code",
      width: 150,  // Adjust width for Code column
      align: "center",  // Align text to the center
    },
    {
      title: "Country",
      dataIndex: "country",
      render: (id) => countries.find((c) => c.id === id)?.name || "N/A",
      width: 200,  // Adjust width for Country column
      align: "center",  // Align text to the left
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </>
      ),
      width: 200,  // Adjust width for Actions column
      align: "center",  // Align actions to the center
    },
  ];
  
  return (
    <div>
      <Typography.Title level={2}>States</Typography.Title>

      <Row gutter={16} style={{ marginBottom: 16 }} align="middle">
        <Col flex="auto">
          <Search
            placeholder="Search by state name"
            onSearch={handleSearch}
            allowClear
            enterButton
          />
        </Col>
        <Col flex="250px">
          <Select
            placeholder="Filter by country"
            allowClear
            style={{ width: "100%" }}
            onChange={handleCountryChange}
          >
            {countries.map((country) => (
              <Option key={country.id} value={country.id}>
                {country.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Button type="primary" onClick={handleAdd}>Add State</Button>
        </Col>
        <Col>
          <Button danger onClick={handleBulkDelete} disabled={!selectedRowKeys.length}>
            Delete Selected
          </Button>
        </Col>
      </Row>

      {error && <Alert type="error" message={error} />}
      {loading ? (
        <Spin />
      ) : (
        <>
          <Table
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
      pageSize={10}
      total={totalCount}
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
