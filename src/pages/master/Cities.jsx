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
  const [allCities, setAllCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const pageSize = 10;

  useEffect(() => {
    fetchCountries();
    fetchStates();
    fetchAllCities();
  }, []);

  useEffect(() => {
    filterCities();
  }, [searchTerm, currentPage, allCities, states, countries]);

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

  const fetchAllCities = async () => {
    setLoading(true);
    try {
      let page = 1;
      let results = [];
      let hasMore = true;
      while (hasMore) {
        const res = await getCities(`?page=${page}`);
        results = [...results, ...(res.results || [])];
        if (!res.next) {
          hasMore = false;
        } else {
          page++;
        }
      }
      setAllCities(results);
    } catch {
      setError("Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  const filterCities = () => {
    let filtered = allCities;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((city) => {
        const stateName = states.find((s) => s.id === city.state)?.state || "";
        const countryName = countries.find((c) => c.id === city.country)?.name || "";
        return (
          city.city.toLowerCase().includes(term) ||
          stateName.toLowerCase().includes(term) ||
          countryName.toLowerCase().includes(term)
        );
      });
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setCities(filtered.slice(start, end));
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
    try {
      await deleteCity(id);
      message.success("Deleted successfully");
      fetchAllCities();
    } catch {
      message.error("Failed to delete city");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Delete selected items?")) return;
    await Promise.all(selectedRowKeys.map((id) => deleteCity(id)));
    setSelectedRowKeys([]);
    fetchAllCities();
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
      fetchAllCities();
    } catch {
      message.error("Failed to save city");
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
      align: "center",
      width: 200,
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Cities</Typography.Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
  <Col xs={24} sm={24} md={16}>
    <Search
      placeholder="Search by City, State, or Country"
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
  <Col xs={24} sm={24} md={8}>
    <Row gutter={[8, 8]} justify="end">
      <Col xs={24} sm={12} md={12}>
        <Button type="primary" block onClick={handleAdd}>
          Add City
        </Button>
      </Col>
      <Col xs={24} sm={12} md={12}>
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
                pageSize={pageSize}
                total={
                  allCities.filter((city) => {
                    const stateName = states.find((s) => s.id === city.state)?.state || "";
                    const countryName = countries.find((c) => c.id === city.country)?.name || "";
                    return (
                      city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      countryName.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                  }).length
                }
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
