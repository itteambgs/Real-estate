import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getRoles,
  deleteRole
} from '../../helpers/apiHelper';

import RoleList from './RoleList';

import {
  Typography,
  Button,
  message
} from 'antd';


const { Title } = Typography;

const RolePage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    const rolesData = await getRoles();
    setRoles(Array.isArray(rolesData) ? rolesData : []);
  };

  const handleEdit = (role) => {
    navigate(`/role/edit/${role.id}`);
  };

  const handleDelete = async (roleId) => {
    await deleteRole(roleId);
    loadRoles();
    message.success('Role deleted');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Title level={2} style={{ margin: 0 }}>Role Management</Title>
        <Button type="primary" onClick={() => navigate('/role/create')}>
          + Add Role
        </Button>
      </div>

      <RoleList roles={roles} onEdit={handleEdit} onDelete={handleDelete} />
  
    </div>
  );
};

export default RolePage;
