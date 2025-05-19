import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, message } from 'antd';
import {
  getCountries,
  getStates,
  getBHKTypes,
  getCities,
  getownership,
  getPropertyType,
  getUsers,
  addProperty
} from 'helpers/apiHelper';

const { TextArea } = Input;
const { Option } = Select;

const CreateProperty = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [bhktypes, setBhkTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [ownership, setOwnership] = useState([]);
  const [propertyType, setPropertyType] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [
        countriesRes,
        statesRes,
        bhkRes,
        citiesRes,
        ownershipRes,
        propertyTypeRes,
        usersRes
      ] = await Promise.all([
        getCountries(),
        getStates(),
        getBHKTypes(),
        getCities(),
        getownership(),
        getPropertyType(),
        getUsers() // Fetch user list
      ]);

      setCountries(countriesRes.results || []);
      setStates(statesRes.results || []);
      setBhkTypes(bhkRes.results || []);
      setCities(citiesRes.results || []);
      setOwnership(ownershipRes.results || []);
      setPropertyType(propertyTypeRes.results || []);
      setUsers(usersRes.results || []);
    } catch (err) {
      message.error("Failed to load dropdown data");
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const selectedUserId = values.user;

      const payload = {
        ...values,
        user: selectedUserId,            // ✔ Assign to actual user field
        added_by: selectedUserId,        // optional, if backend accepts it
        last_edited_by: selectedUserId,  // optional
        purchase_date: values.purchase_date?.format("YYYY-MM-DD") || null,
        insurance_expiry_date: values.insurance_expiry_date?.format("YYYY-MM-DD") || null,
      };

      const result = await addProperty(payload);
      if (result.success) {
        message.success("Property added successfully");
        form.resetFields();

        // Redirect to master/properties page
        window.location.href = '/master/properties'; // Redirect after successful submission
      } else {
        message.error(result.error || "Failed to submit property");
      }
    } catch (err) {
      message.error("Submission error");
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
      <h1>Add property</h1>
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="User" name="user" rules={[{ required: true }]}>
        <Select placeholder="Select User" loading={users.length === 0}>
          {users.map(user => (
            <Option key={user.id} value={user.id}>{user.username}</Option>
          ))}
        </Select>
      </Form.Item>

      {[ 
        { label: "Property Name", name: "property_name" },
        { label: "Plot Number", name: "plot_number" },
        { label: "Survey Number", name: "survey_number" },
        { label: "Patta Number", name: "patta_number" },
        { label: "Subdivision Number", name: "subdivision_number" },
        { label: "Building/Flat Number", name: "building_or_flat_no" },
        { label: "Village", name: "village" },
        { label: "Address Line 1", name: "address1" },
        { label: "Address Line 2", name: "address2" },
        { label: "Postcode", name: "postcode" },
        { label: "Locality", name: "locality" },
        { label: "Street", name: "street" },
        { label: "Guideline Value", name: "guideline_value" },
        { label: "Market Value", name: "market_value" },
        { label: "Rental Value", name: "rental_value" },
        { label: "Age of Property", name: "age" },
        { label: "Government Property ID", name: "property_govt_id" },
        { label: "Property Insurance", name: "property_insurance" },
        { label: "Apartment Name", name: "apartment_name" },
        { label: "Built-up Area (sqft)", name: "built_up_area" },
        { label: "Carpet Area (sqft)", name: "carpet_area" },
        { label: "Total Property Area", name: "property_area" },
        { label: "Facing", name: "facing" },
        { label: "Floor Type", name: "floor_type" },
        { label: "Floor Number", name: "floor" },
        { label: "Total Floors", name: "total_floor" },
        { label: "Furnishing", name: "furnishing" },
        { label: "Parking", name: "parking" },
        { label: "Kitchen Type", name: "kitchen_type" },
        { label: "Maintenance Cost", name: "maintenance_cost" },
      ].map(field => (
        <Form.Item key={field.name} label={field.label} name={field.name}>
          <Input />
        </Form.Item>
      ))}

      <Form.Item label="Purchase Price" name="purchase_price">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="Purchase Date" name="purchase_date">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="Insurance Expiry Date" name="insurance_expiry_date">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="BHK Type" name="bhk_type">
        <Select placeholder="Select BHK Type" loading={bhktypes.length === 0}>
          {bhktypes.map(bhk => (
            <Option key={bhk.id} value={bhk.id}>{bhk.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="City" name="city">
        <Select placeholder="Select City" loading={cities.length === 0}>
          {cities.map(city => (
            <Option key={city.id} value={city.id}>{city.city}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="State" name="state">
        <Select placeholder="Select State" loading={states.length === 0}>
          {states.map(state => (
            <Option key={state.id} value={state.id}>{state.state}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Country" name="country">
        <Select placeholder="Select Country" loading={countries.length === 0}>
          {countries.map(country => (
            <Option key={country.id} value={country.id}>{country.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Ownership Type" name="ownership_type">
        <Select placeholder="Select Ownership" loading={ownership.length === 0}>
          {ownership.map(owner => (
            <Option key={owner.id} value={owner.id}>{owner.ownership_type}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Property Type" name="property_type">
        <Select placeholder="Select Property Type" loading={propertyType.length === 0}>
          {propertyType.map(type => (
            <Option key={type.id} value={type.id}>{type.type_name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Description" name="description">
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit Property
        </Button>
      </Form.Item>
    </Form>
    </>
  );
};

export default CreateProperty;
