import React from 'react';
import { Form, Input, Button, Typography, Card, Row, Col, Checkbox } from 'antd';

const { Title } = Typography;

const CreateRoleForm = ({
  formType,
  roleName,
  setRoleName,
  selectedPermissions,
  setSelectedPermissions,
  handleSubmit,
  permissionsList
}) => {
  const [form] = Form.useForm();

  const onFinish = () => {
    handleSubmit();
  };

  return (
    <Row justify="center" style={{ marginTop: '3rem' }}>
      <Col xs={24} sm={20} md={18} lg={16}>
        <Card
          title={<Title level={3} style={{ margin: 0 }}>{formType === 'edit' ? 'Edit Role' : 'Create New Role'}</Title>}
          bordered
          style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ roleName, permissions: selectedPermissions }}
          >
            <Row gutter={24}>
              {/* Role Name Field */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Role Name"
                  name="roleName"
                  rules={[{ required: true, message: 'Please enter a role name' }]}
                >
                  <Input
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g. Admin, Manager, Viewer"
                    size="large"
                  />
                </Form.Item>
              </Col>

              {/* Permissions Field */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Assign Permissions"
                  name="permissions"
                  rules={[{ required: true, message: 'Please select at least one permission' }]}
                >
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    value={selectedPermissions}
                    onChange={setSelectedPermissions}
                  >
                    <Row>
                      {permissionsList.map((permission) => (
                        <Col span={24} key={permission.id} style={{ marginBottom: '0.5rem' }}>
                          <Checkbox value={permission.id}>
                            {permission.name}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                disabled={!roleName.trim() || selectedPermissions.length === 0}
              >
                {formType === 'edit' ? 'Update Role' : 'Create Role'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default CreateRoleForm;