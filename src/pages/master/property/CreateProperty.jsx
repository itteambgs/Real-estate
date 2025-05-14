import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, message } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

const CreateProperty = ({ formData, setFormData, handleSubmit, loading, success, error, dropdownOptions }) => {
  const [form] = Form.useForm();

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log("Dropdown Options: ", dropdownOptions);  // To check if dropdownOptions are passed correctly
  }, [dropdownOptions]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={formData}
    >
      {/* Text Inputs */}
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
          <Input onChange={e => handleChange(field.name, e.target.value)} />
        </Form.Item>
      ))}

      {/* Number and Date Inputs */}
      <Form.Item label="Purchase Price" name="purchase_price">
        <InputNumber style={{ width: '100%' }} onChange={value => handleChange('purchase_price', value)} />
      </Form.Item>

      <Form.Item label="Purchase Date" name="purchase_date">
        <DatePicker style={{ width: '100%' }} onChange={(date, dateString) => handleChange('purchase_date', dateString)} />
      </Form.Item>

      <Form.Item label="Insurance Expiry Date" name="insurance_expiry_date">
        <DatePicker style={{ width: '100%' }} onChange={(date, dateString) => handleChange('insurance_expiry_date', dateString)} />
      </Form.Item>

      {/* Dropdowns */}
      <Form.Item label="BHK Type" name="bhk_type">
        <Select onChange={value => handleChange('bhk_type', value)} allowClear>
          {dropdownOptions?.bhkTypes?.length ? (
            dropdownOptions.bhkTypes.map(option => (
              <Option key={option.value} value={option.value}>{option.text}</Option>
            ))
          ) : (
            <Option value="empty">No options available</Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item label="City" name="city">
        <Select onChange={value => handleChange('city', value)} allowClear>
          {dropdownOptions?.cities?.length ? (
            dropdownOptions.cities.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))
          ) : (
            <Option value="empty">No options available</Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item label="State" name="state">
        <Select onChange={value => handleChange('state', value)} allowClear>
          {dropdownOptions?.states?.length ? (
            dropdownOptions.states.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))
          ) : (
            <Option value="empty">No options available</Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item label="Country" name="country">
        <Select onChange={value => handleChange('country', value)} allowClear>
          {dropdownOptions?.countries?.length ? (
            dropdownOptions.countries.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))
          ) : (
            <Option value="empty">No options available</Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item label="Ownership Type" name="ownership_type">
        <Select onChange={value => handleChange('ownership_type', value)} allowClear>
          {dropdownOptions?.ownershipTypes?.length ? (
            dropdownOptions.ownershipTypes.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))
          ) : (
            <Option value="empty">No options available</Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item label="Property Type" name="property_type">
        <Select onChange={value => handleChange('property_type', value)} allowClear>
          {dropdownOptions?.propertyTypes?.length ? (
            dropdownOptions.propertyTypes.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))
          ) : (
            <Option value="empty">No options available</Option>
          )}
        </Select>
      </Form.Item>

      {/* Description */}
      <Form.Item label="Description" name="description">
        <TextArea rows={4} onChange={e => handleChange('description', e.target.value)} />
      </Form.Item>

      {/* Messages */}
      {success && message.success(success)}
      {error && message.error(error)}

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit Property
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProperty;
