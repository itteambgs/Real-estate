import React, { useState, useEffect } from 'react';
import RoleList from './RoleList';
import CreateRole from './CreateRole';
import EditRole from './EditRole';
import { getRoles } from '../../helpers/apiHelper';

const RolePage = () => {
  const [roles, setRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      const data = await getRoles();
      setRoles(data);
    };
    fetchRoles();
  }, []);

  const handleAdd = (newRole) => {
    setRoles([...roles, newRole]);
    setShowCreate(false);
  };

  const handleUpdate = (updatedRole) => {
    setRoles(roles.map(r => (r.id === updatedRole.id ? updatedRole : r)));
    setEditingRole(null);
  };

  const handleDelete = (id) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  return (
    <div style={{ padding: '0rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>User Role Management</h1>
        <button
          onClick={() => {
            setEditingRole(null);
            setShowCreate(true);
          }}
          className="edit-btn"
        >
          Add
        </button>
      </div>

      <RoleList
        roles={roles}
        onEdit={(role) => {
          setEditingRole(role);
          setShowCreate(false);
        }}
        onDelete={handleDelete}
      />

      <CreateRole
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleAdd}
      />
      {editingRole && <EditRole role={editingRole} onSubmit={handleUpdate} />}
    </div>
  );
};

export default RolePage;
