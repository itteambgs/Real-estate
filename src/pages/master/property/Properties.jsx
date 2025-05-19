import React, { useEffect, useState } from "react";
import {
  getProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  getCities,
  getBHKTypes,
  getStates,
  getCountries,
  getownership,
  getPropertyTypes,
  getUsers,
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
  Select,
  Popconfirm,
} from "antd";
import "antd/dist/reset.css";

const { Search } = Input;
const pageSize = 10;

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [cities, setCities] = useState([]);
  const [bhkTypes, setBhkTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [ownershipTypes, setOwnershipTypes] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAllProperties();
    fetchDropdownData();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [searchTerm, currentPage, allProperties]);

  const fetchDropdownData = async () => {
    try {
      const [cRes, sRes, cnRes, oRes, pRes, uRes, bRes] = await Promise.all([
        getCities(),
        getStates(),
        getCountries(),
        getownership(),
        getPropertyTypes(),
        getUsers(),
        getBHKTypes(),
      ]);
      setCities(cRes.results || []);
      setStates(sRes.results || []);
      setCountries(cnRes.results || []);
      setOwnershipTypes(oRes.results || []);
      setPropertyTypes(pRes.results || []);
      setUsers(uRes.results || []);
      setBhkTypes(bRes.results || []);
    } catch (err) {
      message.error("Failed to load dropdown data.");
    }
  };

  const fetchAllProperties = async () => {
    setLoading(true);
    try {
      let page = 1;
      let results = [];
      let hasMore = true;
      while (hasMore) {
        const res = await getProperties(`?page=${page}`);
        results = [...results, ...(res.results || [])];
        hasMore = !!res.next;
        page++;
      }
      setAllProperties(results);
    } catch (err) {
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = allProperties;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((prop) =>
        prop.property_name?.toLowerCase().includes(term)
      );
    }
    const start = (currentPage - 1) * pageSize;
    setProperties(filtered.slice(start, start + pageSize));
  };

  const handleEdit = (record) => {
    setCurrentProperty(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id);
      message.success("Property deleted");
      fetchAllProperties();
    } catch {
      message.error("Failed to delete property");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRowKeys.length) return;
    if (!window.confirm("Delete selected properties?")) return;
    try {
      await Promise.all(selectedRowKeys.map((id) => deleteProperty(id)));
      setSelectedRowKeys([]);
      message.success("Selected properties deleted.");
      fetchAllProperties();
    } catch (error) {
      message.error("Failed to delete selected properties.");
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setCurrentProperty(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleView = (record) => {
    setViewRecord(record);
    setIsViewModalOpen(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (isEditing) {
        const updatedProperty = { ...currentProperty, ...values };
        const response = await updateProperty(currentProperty.id, updatedProperty);
        if (response.success) {
          message.success("Property updated successfully");
        } else {
          message.error(response.error || "Failed to update property");
        }
      } else {
        const response = await addProperty(values);
        if (response.success) {
          message.success("Property added successfully");
        } else {
          message.error(response.error || "Failed to add property");
        }
      }
      setIsModalOpen(false);
      fetchAllProperties();
    } catch (err) {
      message.error("Something went wrong.");
    }
  };

  const displayFields = [
    "property_name",
    "plot_number",
    "survey_number",
    "patta_number",
    "subdivision_number",
  ];

  const columns = [
    {
      title: "No",
      dataIndex: "serial",
      key: "serial",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    ...displayFields.map((key) => ({
      title: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      dataIndex: key,
      key,
      render: (text) => (text ? text.toString() : "-"),
    })),
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleView(record)}>View</Button>
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  return (
    <div>
      <Typography.Title level={3}>Properties</Typography.Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={24} md={16}>
          <Search
            placeholder="Search by property name"
            allowClear
            enterButton
            onSearch={(value) => setSearchTerm(value)}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Row gutter={[8, 8]} justify="end">
            <Col xs={24} sm={12} md={12}>
              <Button type="primary" block onClick={handleAdd}>
                Add Property
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


      {error && (
        <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
      )}

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          rowSelection={rowSelection}
          dataSource={properties}
          columns={columns}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            current: currentPage,
            pageSize,
            total: allProperties.length,
            onChange: setCurrentPage,
          }}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={isEditing ? "Edit Property" : "Add Property"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={isEditing ? "Update" : "Add"}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="property_name"
                label="Property Name"
                rules={[{ required: true, message: "Please enter property name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="plot_number"
                label="Plot Number"
                rules={[{ required: false, message: "Please enter plot number" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="survey_number"
                label="Survey Number"
                rules={[{ required: false, message: "Please enter survey number" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="patta_number"
                label="Patta Number"
                rules={[{ required: false, message: "Please enter patta number" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="subdivision_number"
                label="Subdivision Number"
                rules={[{ required: false, message: "Please enter subdivision number" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="building_or_flat_no"
                label="Building or Flat No"
                rules={[{ required: false, message: "Please enter Building or Flat No" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="village"
                label="Village"
                rules={[{ required: false, message: "Please enter Village" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="address1"
                label="Address1"
                rules={[{ required: false, message: "Please enter Address1" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="address2"
                label="Address2"
                rules={[{ required: false, message: "Please enter Address2" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="postcode"
                label="Postcode"
                rules={[{ required: false, message: "Please enter postcode" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="locality"
                label="Locality"
                rules={[{ required: false, message: "Please enter Locality" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="street"
                label="Street"
                rules={[{ required: false, message: "Please enter Street" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="purchase_price"
                label="Purchase Price"
                rules={[{ required: false, message: "Please enter Purchase Price" }]}
              >
                <Input type="number"/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="purchase_date"
                label="Purchase Date"
                rules={[{ required: false, message: "Please enter Purchase Date" }]}
              >
                <Input type="date"/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="guideline_value"
                label="Purchase Guideline Value"
                rules={[{ required: false, message: "Please enter Guideline Value" }]}
              >
                <Input type="number"/>
              </Form.Item>
            </Col>
            <Col span={6}>
            <Form.Item
                name="market_value"
                label="Market value"
                rules={[{ required: false, message: "Please enter Market value" }]}
              >
                <Input type="number"/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="rental_value"
                label="Rental Value"
                rules={[{ required: false, message: "Please enter Rental Value" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="age"
                label="Age"
                rules={[{ required: false, message: "Please enter Age" }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="property_govt_id"
                label="Property Govt ID"
                rules={[{ required: true, message: "Please enter Property Govt ID" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="property_insurance"
                label="Property Insurance"
                rules={[{ required: false, message: "Please enter Property Insurance" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="insurance_expiry_date"
                label="Insurance Expiry Date"
                rules={[{ required: false, message: "Please enter Insurance Expiry Date" }]}
              >
                <Input type="date"/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="apartment_name"
                label="Apartment Name"
                rules={[{ required: false, message: "Please enter Apartment Name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="built_up_area"
                label="Built Up Area"
                rules={[{ required: false, message: "Please enter Built Up Area" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="carpet_area"
                label="Carpet Area"
                rules={[{ required: false, message: "Please enter Carpet Area" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="property_area"
                label="Property Area"
                rules={[{ required: false, message: "Please enter Property Area" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="facing"
                label="Facing"
                rules={[{ required: false, message: "Please enter Facing" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="floor_type"
                label="Floor Type"
                rules={[{ required: false, message: "Please enter Floor Type" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="floor"
                label="Floor"
                rules={[{ required: false, message: "Please enter Floor" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="total_floor"
                label="Total Floor"
                rules={[{ required: false, message: "Please enter Total Floor" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="furnishing"
                label="Furnishing"
                rules={[{ required: false, message: "Please enter Furnishing" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="parking"
                label="Parking"
                rules={[{ required: false, message: "Please enter Parking" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="kitchen_type"
                label="Kitchen Type"
                rules={[{ required: false, message: "Please enter Kitchen Type" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="maintenance_cost"
                label="Maintenance Cost"
                rules={[{ required: false, message: "Please enter Maintenance Cost" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: false, message: "Please enter Description" }]}
              >
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
            <Col span={6}>
            <Form.Item name="bhk_type" label="BHK Type" rules={[{ required: false, message: 'Please select BHK type' }]}>
                 <Select placeholder="Select BHK type">
               {bhkTypes.map((type) => (
               <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
                  ))}
                  </Select>
                </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="city" label="City" rules={[{ required: false, message: 'Please select City' }]}>
              <Select placeholder="Select City">
                        {cities.map((c) => (
                          <Option key={c.id} value={c.id}>{c.city}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
                <Form.Item name="state" label="State" rules={[{ required: false, message: 'Please select state' }]}>
                <Select placeholder="Select State">
                        {states.map((s) => (
                          <Option key={s.id} value={s.id}>{s.state}</Option>
                        ))}
                      </Select>
                    </Form.Item>
            </Col>
            <Col span={6}>
               <Form.Item name="country" label="Country" rules={[{ required: false, message: 'Please select country' }]}>
               <Select placeholder="Select Country">
                        {countries.map((c) => (
                          <Option key={c.id} value={c.id}>{c.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
            </Col>
            <Col span={6}>
          <Form.Item name="ownership_type" label="Ownership type" rules={[{ required: false, message: 'Please select Ownership type' }]}>
                 <Select placeholder="Select Ownership type">
               {ownershipTypes.map((o) => (
               <Option key={o.id} value={o.id}>{o.ownership_type}</Option>
                  ))}
                  </Select>
                </Form.Item>
            </Col>
            <Col span={6}>
            <Form.Item
                   name="property_type"
                    label="Property Type"
                   rules={[{ required: false, message: 'Please select a property type' }]}
                      >
                     <Select placeholder="Select property type">
                      {propertyTypes.map((type) => (
                      <Option key={type.id} value={type.id}>
                       {type.type_name}
                        </Option>
                        ))}
                    </Select>
                    </Form.Item>
               </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
            <Form.Item name="user" label="User" rules={[{ required: true, message: 'Please select a user' }]}>
  <Select placeholder="Select a user">
    {users.map((user) => (
      <Option key={user.id} value={user.id}>
        {user.name || user.username || user.email}
        
      </Option>
    ))}
  </Select>
</Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="View Property Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={800}
        
      >
        {viewRecord && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {Object.entries(viewRecord)
                .reduce((rows, [key, value], index) => {
                  const cell = (
                    <td
                      key={key}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        verticalAlign: "top",
                        width: "25%",
                      }}
                    >
                      <strong>{key.replace(/_/g, " ").toUpperCase()}</strong>
                      <br />
                      {value || "-"}
                    </td>
                  );
                  const rowIndex = Math.floor(index / 4);
                  if (!rows[rowIndex]) rows[rowIndex] = [];
                  rows[rowIndex].push(cell);
                  return rows;
                }, [])
                .map((row, index) => <tr key={index}>{row}</tr>)
              }
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  );
};

export default Properties;