import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Radio, DatePicker, Select, Row, Col, message } from 'antd';
// import moment from 'moment';
import { addUser, getRoles, assignRoleToUser } from '../../helpers/apiHelper';

const { Option } = Select;

const AddUser = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roleList = await getRoles();
        setRoles(Array.isArray(roleList) ? roleList : []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const userPayload = {
        first_name: values.first_name,
        last_name: values.last_name,
        username: values.username,
        email: values.email,
        phone_number: values.phone_number,
        password: values.password,
        is_active: values.status === 'true',
        is_superuser: values.super_user === 'true',
        date_joined: values.date_joined?.toISOString(),
      };

      const newUser = await addUser(userPayload);
      const userId = newUser?.id;

      if (!userId) {
        message.error("User creation failed. No ID returned.");
        setLoading(false);
        return;
      }

      if (selectedRole.length) {
        await assignRoleToUser(userId, selectedRole);
      }

      message.success("User created and roles assigned successfully!");
      navigate("/users");
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to create user or assign roles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#fff' }}>
      <h2>Create User</h2>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          status: 'true',
          super_user: 'false',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="First Name" name="first_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Last Name" name="last_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Username" name="username">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Phone Number" name="phone_number">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Date Joined" name="date_joined">
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Role">
              <Select
                mode="multiple"
                placeholder="Select Role(s)"
                value={selectedRole}
                onChange={setSelectedRole}
                options={roles.map(r => ({ label: r.name, value: r.id }))}
                loading={loading}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Status" name="status">
              <Radio.Group>
                <Radio value="true">Active</Radio>
                <Radio value="false">Inactive</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Super User" name="super_user">
              <Radio.Group>
                <Radio value="true">Yes</Radio>
                <Radio value="false">No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
          <Button
            type="default"
            onClick={() => navigate(-1)}
            style={{ marginLeft: '8px' }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddUser;