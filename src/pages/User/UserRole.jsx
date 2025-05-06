import React, { useState, useEffect } from 'react';
import { Select, Button, message, Spin, Space } from 'antd';
import { getUsers, getRoles, assignRoleToUser } from 'helpers/apiHelper';

function UserRole() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userList, roleList] = await Promise.all([getUsers(), getRoles()]);
        console.log("Users API response:", userList);
        console.log("Roles API response:", roleList);
  
        // Ensure arrays before setting state
        setUsers(Array.isArray(userList.results) ? userList.results : []);

        setRoles(Array.isArray(roleList) ? roleList : []);
      } catch (error) {
        console.error(error);
        message.error('Failed to load users or roles');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      message.error('Please select both user and role');
      return;
    }

    setLoading(true);
    try {
      const result = await assignRoleToUser(selectedUser, selectedRole);
      if (result) {
        message.success('Role assigned successfully');
      } else {
        message.error('Failed to assign role');
      }
    } catch (err) {
      console.error(err);
      message.error('Error assigning role');
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
          onChange={setSelectedUser}
          options={users.map(user => ({ label: user.username || user.name, value: user.id }))}
          value={selectedUser}
          disabled={loading}
        />
            <Select
        mode="multiple"
        placeholder="Select Role(s)"
        value={selectedRole}
        onChange={setSelectedRole}
        options={roles.map(r => ({ label: r.name, value: r.id }))}
        style={{ width: '100%' }}
        disabled={loading}
        />

        <Button
          type="primary"
          onClick={handleAssignRole}
          disabled={loading}
          loading={loading}
        >
          Assign Role
        </Button>
      </Space>
    </div>
  );
}

export default UserRole;
