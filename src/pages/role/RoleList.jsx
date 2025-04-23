import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Button, Typography, Space, message } from 'antd';

const { Title, Text } = Typography;

const RoleList = ({ roles }) => {
  const navigate = useNavigate();

  const handleEdit = (roleId) => {
    navigate(`/role/edit/${roleId}`);
  };

  const handleDelete = (roleId) => {
    message.warning('Delete clicked. Move logic to parent or pass it in as prop.');
  };

  return (
    <Card title={<Title level={3}>Existing Roles</Title>} bordered style={{ marginTop: '2rem' }}>
      {roles.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={roles}
          renderItem={(role) => (
            <List.Item
              actions={[
                <Button type="primary" onClick={() => handleEdit(role.id)}>
                  Edit
                </Button>,
                <Button danger onClick={() => handleDelete(role.id)}>
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={<Text strong>{role.name}</Text>}
              />
            </List.Item>
          )}
        />
      ) : (
        <Text>No roles found.</Text>
      )}
    </Card>
  );
};

export default RoleList;
