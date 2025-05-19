import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, Radio, message, Row, Col } from 'antd';
import { getUserById, updateUser, getRoles, getUserRole, assignRoleToUser } from '../../helpers/apiHelper';

const { Option } = Select;

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserById(id);
        if (user) {
          form.setFieldsValue({
            ...user,
            status: user.is_active,
            super_user: user.is_superuser,
            date_joined: user.date_joined ? user.date_joined.slice(0, 16) : '',
          });
        }

        const roleList = await getRoles();
        setRoles(roleList);

        const userRoleRes = await getUserRole(id);
        const selectedRoles = roleList
          .filter(role => userRoleRes.groups.includes(role.name))
          .map(role => role.id);

        setSelectedRole(selectedRoles);
      } catch (error) {
        console.error("Error loading user or roles:", error);
        message.error("Failed to load user data.");
      }
    };

    fetchData();
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        is_active: values.status,
        is_superuser: values.super_user,
      };

      if (!payload.password) {
        delete payload.password; // Don’t update password if empty
      }

      await updateUser(id, payload);
      await assignRoleToUser(id, selectedRole);
      message.success('User updated successfully!');
      setTimeout(() => navigate('/user-role'), 1000); // ✅ Redirect to /user-role
    } catch (error) {
      console.error("Update failed:", error);
      message.error('Failed to update user');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle">
        <h2>Edit User</h2>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Row>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: true, super_user: false }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone_number" label="Phone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="password" label="Password">
              <Input.Password placeholder="Leave blank to keep current password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="date_joined" label="Date Joined">
              <Input type="datetime-local" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Role">
              <Select
                mode="multiple"
                placeholder="Select Role(s)"
                value={selectedRole}
                onChange={setSelectedRole}
              >
                {roles.map(role => (
                  <Option key={role.id} value={role.id}>{role.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Status">
              <Radio.Group>
                <Radio value={true}>Active</Radio>
                <Radio value={false}>Inactive</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="super_user" label="Super Admin">
              <Radio.Group>
                <Radio value={true}>Active</Radio>
                <Radio value={false}>Inactive</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">Update</Button>
          <Button onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>Cancel</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUser;