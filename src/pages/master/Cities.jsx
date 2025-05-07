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
  getCities,
  addCity,
  updateCity,
  deleteCity,
  getCountries,
  getStates,
} from "helpers/apiHelper";

const { Option } = Select;
const { Search } = Input;

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    fetchCountries();
    fetchStates();
  }, []);

  useEffect(() => {
    fetchCities();
  }, [currentPage, searchTerm, filterState]);

  const fetchCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res.results || []);
    } catch {
      message.error("Failed to load countries");
    }
  };

  const fetchStates = async () => {
    try {
      const res = await getStates();
      setStates(res.results || []);
    } catch {
      message.error("Failed to load states");
    }
  };

  const fetchCities = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append("page", currentPage);
    if (searchTerm) params.append("search", searchTerm);
    if (filterState) params.append("state", filterState);

    try {
      const res = await getCities(`?${params.toString()}`);
      setCities(res.results || []);
      setTotalCount(res.count || 0);
    } catch {
      setError("Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStateSearch = (value) => {
    setFilterState(value);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    form.resetFields();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setCurrentCity(record);
    setIsEditing(true);
    form.setFieldsValue({
      city: record.city,
      state: record.state,
      country: record.country,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this city?")) return;
    await deleteCity(id);
    message.success("Deleted");
    fetchCities();
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Delete selected items?")) return;
    await Promise.all(selectedRowKeys.map((id) => deleteCity(id)));
    setSelectedRowKeys([]);
    fetchCities();
  };

  const handleFormSubmit = async (values) => {
    const data = {
      city: values.city,
      state: values.state,
      country: values.country,
    };

    try {
      if (isEditing) {
        await updateCity(currentCity.id, data);
        message.success("City updated");
      } else {
        await addCity(data);
        message.success("City added");
      }
      setIsModalOpen(false);
      fetchCities();
    } catch {
      message.error("Failed to save city");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
      width: 100,
    },
    {
      title: "City",
      dataIndex: "city",
      align: "left",
      width: 200,
    },
    {
      title: "State",
      dataIndex: "state",
      render: (id) => states.find((s) => s.id === id)?.state || "N/A",
      align: "center",
      width: 200,
    },
    {
      title: "Country",
      dataIndex: "country",
      render: (id) => countries.find((c) => c.id === id)?.name || "N/A",
      align: "center",
      width: 200,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </>
      ),
      align: "center",
      width: 200,
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Cities</Typography.Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Search placeholder="Search by city name" onSearch={handleCitySearch} enterButton allowClear />
        </Col>
        <Col flex="auto">
          <Search placeholder="Search by state" onSearch={handleStateSearch} enterButton allowClear />
        </Col>
        <Col flex="250px">
          <Select placeholder="Filter by state" allowClear style={{ width: "100%" }} onChange={handleStateSearch}>
            {states.map((state) => (
              <Option key={state.id} value={state.id}>{state.state}</Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Button type="primary" onClick={handleAdd}>Add City</Button>
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
            dataSource={cities}
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
        title={isEditing ? "Edit City" : "Add City"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={isEditing ? "Update" : "Add"}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item name="city" label="City Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="country" label="Country" rules={[{ required: true }]}>
            <Select placeholder="Select country" loading={countries.length === 0}>
              {countries.map((country) => (
                <Option key={country.id} value={country.id}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="state" label="State" rules={[{ required: true }]}>
            <Select placeholder="Select state" loading={states.length === 0}>
              {states.map((state) => (
                <Option key={state.id} value={state.id}>
                  {state.state}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Cities;
