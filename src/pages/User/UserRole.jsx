import React, { useState, useEffect } from 'react';
import { Select, Button, message, Spin, Card, Typography, Divider } from 'antd';
import { getUsers, getRoles, assignRoleToUser } from 'helpers/apiHelper';

const { Title, Text } = Typography;

function UserRole() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userList, roleList] = await Promise.all([getUsers(), getRoles()]);
        setUsers(Array.isArray(userList.results) ? userList.results : []);
        setRoles(Array.isArray(roleList) ? roleList : []);
      } catch (error) {
        message.error('Failed to load users or roles');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignRole = async () => {
    if (!selectedUser || selectedRoles.length === 0) {
      message.error('Please select a user and at least one role.');
      return;
    }

    setLoading(true);
    try {
      const result = await assignRoleToUser(selectedUser, selectedRoles);
      if (result) {
        message.success('Roles assigned successfully');
        setSelectedRoles([]);
      } else {
        message.error('Failed to assign roles');
      }
    } catch (err) {
      console.error(err);
      message.error('Error assigning roles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Card bordered hoverable bodyStyle={{ minHeight: '300px' }}>
        <Title level={4}>Assign Role to User</Title>
        <Text>Select a user to begin:</Text>
        <Select
          placeholder="Select a user"
          onChange={setSelectedUser}
          options={users.map(user => ({
            label: `${user.first_name} `,
            value: user.id,
          }))}
          value={selectedUser}
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={loading}
        />

        {selectedUser && (
          <>
            <Divider />
            <Text>Select role(s):</Text>
            <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
              <Select
                mode="multiple"
                placeholder="Select role(s)"
                value={selectedRoles}
                onChange={setSelectedRoles}
                options={roles.map(role => ({ label: role.name, value: role.id }))}
                style={{ width: '100%' }}
                disabled={loading}
                maxTagCount={2}
              />
            </div>
            <Button
              type="primary"
              block
              style={{ marginTop: '1rem' }}
              onClick={handleAssignRole}
              loading={loading}
            >
              Assign Role(s)
            </Button>
          </>
        )}
      </Card>
      {loading && <div style={{ textAlign: 'center', marginTop: 20 }}><Spin /></div>}
    </div>
  );
}

export default UserRole;
