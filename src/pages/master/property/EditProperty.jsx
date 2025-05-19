import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Use useParams to get the id from the URL
import { getProperty, updateProperty } from 'helpers/apiHelper'; // Helper functions to get and update property
import { Form, Input, Button, message, Spin, Alert } from 'antd';

const EditProperty = () => {
  const { id } = useParams(); // Get the property ID from the URL
  const navigate = useNavigate();
  const [property, setProperty] = useState(null); // Store property data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  // Fetch property data when component mounts
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await getProperty(id);  // Fetch property using the ID
        if (response.success) {
          setProperty(response.data); // Set the property data to state
        } else {
          setError('Failed to fetch property data');
        }
      } catch (err) {
        setError('Failed to fetch property data');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await updateProperty(id, values);  // Send updated data
      if (response.success) {
        message.success('Property updated successfully');
        navigate('/master/properties'); // Redirect to properties list
      } else {
        message.error('Failed to update property');
      }
    } catch (err) {
      message.error('An error occurred while updating the property');
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  return (
    <div>
      <h1>Edit Property</h1>
      <Form
        initialValues={property} // Set initial values of the form to the property data
        onFinish={handleSubmit} // Handle form submission
      >
        <Form.Item label="Property Name" name="name" rules={[{ required: true, message: 'Please input the property name!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input the address!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
          <Input type="number" />
        </Form.Item>

        {/* Add other fields as needed */}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Property
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProperty;
