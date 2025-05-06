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
} from "antd";
import {
  getCities,
  addCities,
  updateCities,
  deleteCities,
  getCountries,
  getStates,
} from "helpers/apiHelper";
import "antd/dist/reset.css";

const { Option } = Select;

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load countries and states initially
  useEffect(() => {
    const init = async () => {
      await fetchCountries();
      await fetchStates();
    };
    init();
  }, []);

  // Fetch city data only after countries and states are loaded
  useEffect(() => {
    if (countries.length && states.length) {
      fetchData(pagination.current);
    }
  }, [countries, states]);

  const fetchData = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCities(page);

      // Enrich city records with state and country names
      const enrichedCities = data.results.map((city) => {
        const countryObj = countries.find((c) => c.id === city.country);
        const stateObj = states.find((s) => s.id === city.state);
        return {
          ...city,
          countryName: countryObj?.name || "N/A",
          stateName: stateObj?.name || "N/A",
        };
      });

      setCities(enrichedCities);
      setPagination({
        current: page,
        pageSize: 10,
        total: data.count,
      });
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError("Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const data = await getCountries();
      setCountries(data.results);
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  const fetchStates = async (countryId = null) => {
    try {
      const data = await getStates(countryId);
      setStates(data.results);
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentCity(null);
    form.resetFields();
    setStates([]); // Empty initially
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setCurrentCity(record);
    fetchStates(record.country).then(() => {
      const selectedState = states.find((s) => s.id === record.state);
      form.setFieldsValue({
        city: record.city,
        country: record.country,
        state: {
          label: selectedState?.name, // Use labelInValue for state
          value: selectedState?.id,
        },
      });
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this city?");
    if (!confirm) return;

    const response = await deleteCities(id);
    if (response.success) {
      fetchData(pagination.current);
      message.success("City deleted successfully");
    } else {
      message.error(`Delete failed: ${response.error}`);
    }
  };

  const handleFormSubmit = async (values) => {
    const payload = {
      city: values.city,
      state: values.state.value,  // Use value (state id) for submission
      country: values.country,
    };

    if (isEditing) {
      const response = await updateCities(currentCity.id, payload);
      if (response.success) {
        fetchData(pagination.current);
        message.success("City updated successfully");
      } else {
        message.error(`Update failed: ${response.error}`);
      }
    } else {
      const response = await addCities(payload);
      if (response.success) {
        fetchData(pagination.current);
        message.success("City added successfully");
      } else {
        message.error(`Add failed: ${response.error}`);
      }
    }
    setIsModalOpen(false);
  };

  const handleCountryChange = (value) => {
    form.setFieldsValue({ state: undefined });
    fetchStates(value);
  };

  const handleTableChange = (pagination) => {
    fetchData(pagination.current);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      width: "25%",
    },
    {
      title: "State",
      dataIndex: "stateName",
      key: "stateName",
      width: "25%",
    },
    {
      title: "Country",
      dataIndex: "countryName",
      key: "countryName",
      width: "20%",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
      width: "20%",
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Cities</Typography.Title>

      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          Add City
        </Button>
      </div>

      {error && <Alert message={error} type="error" showIcon />}

      {loading ? (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={cities}
          columns={columns}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onChange={handleTableChange}
          scroll={{ x: "100%" }}
        />
      )}

      <Modal
        title={isEditing ? "Edit City" : "Add City"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={isEditing ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Please select a country" }]}
          >
            <Select placeholder="Select a country" onChange={handleCountryChange}>
              {countries.map((country) => (
                <Option key={country.id} value={country.id}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: "Please select a state" }]}
          >
            <Select placeholder="Select a state">
              {states.map((state) => (
                <Option key={state.id} value={state.id}>
                  {state.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please enter city name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Cities;