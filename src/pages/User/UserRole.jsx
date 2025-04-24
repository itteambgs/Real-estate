// src/pages/User/UserRole.jsx
import React, { useState, useEffect } from 'react';
import { getUsers, getRoles, assignRoleToUser } from 'helpers/apiHelper';
import { Select, Button, message, Spin, Space } from 'antd';

const UserRole = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersData, rolesData] = await Promise.all([
          getUsers(),
          getRoles()
        ]);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setRoles(rolesData);
      } catch (err) {
        console.error(err);
        message.error('Failed to load users or roles');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      message.error('Please select both a user and a role');
      return;
    }
    setLoading(true);
    try {
      const result = await assignRoleToUser(selectedUser, selectedRole);
      if (result) message.success('Role assigned successfully');
      else message.error('Failed to assign role');
    } catch (err) {
      console.error(err);
      message.error('Failed to assign role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Assign Role to User</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {loading && <Spin />}
        <Select
          placeholder="Select User"
          value={selectedUser}
          onChange={setSelectedUser}
          options={users.map(u => ({ label: u.username || u.name, value: u.id }))}
          style={{ width: '100%' }}
          disabled={loading}
        />
        <Select
          placeholder="Select Role"
          value={selectedRole}
          onChange={setSelectedRole}
          options={roles.map(r => ({ label: r.name, value: r.id }))}
          style={{ width: '100%' }}
          disabled={loading}
        />
        <Button
          type="primary"
          onClick={handleAssignRole}
          loading={loading}
          disabled={loading}
        >
          Assign Role
        </Button>
      </Space>
    </div>
  );
};

export default UserRole;
