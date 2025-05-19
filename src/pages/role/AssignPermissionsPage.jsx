import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getRoles,
  getPermissions,
  assignPermissionsToRole
} from 'helpers/apiHelper';
import { message, Button, Select, Space, Spin } from 'antd';

const AssignPermissionsPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    try {
      const rolesData = await getRoles();
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      message.error('Failed to load roles');
    }
  };

  const loadPermissions = async () => {
    try {
      const permissionsData = await getPermissions();
      setPermissions(Array.isArray(permissionsData) ? permissionsData : []);
    } catch (error) {
      message.error('Failed to load permissions');
    }
  };

  const handleAssignPermissions = async () => {
    if (!selectedRole || selectedPermissions.length === 0) {
      message.error('Please select a role and permissions');
      return;
    }

    setLoading(true);

    try {
      await assignPermissionsToRole(selectedRole, selectedPermissions);
      message.success('Permissions assigned successfully');
      navigate('/roles');
    } catch (error) {
      message.error('Failed to assign permissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Assign Permissions to Role</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Select
          placeholder="Select Role"
          style={{ width: '100%' }}
          value={selectedRole}
          onChange={(value) => setSelectedRole(value)}
        >
          {roles.map((role) => (
            <Select.Option key={role.id} value={role.id}>
              {role.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Select Permissions"
          style={{ width: '100%' }}
          value={selectedPermissions}
          onChange={(value) => setSelectedPermissions(value)}
        >
          {permissions.map((permission) => (
            <Select.Option key={permission.id} value={permission.id}>
              {permission.name}
            </Select.Option>
          ))}
        </Select>

        <Button
          type="primary"
          onClick={handleAssignPermissions}
          loading={loading}
          disabled={loading}
        >
          {loading ? <Spin /> : 'Assign Permissions'}
        </Button>
      </Space>
    </div>
  );
};

export default AssignPermissionsPage;