import React, { useEffect, useState } from 'react';
import {
  getRoles,
  createRole,
  getUsers,
  assignRoleToUser,
  getPermissions,
  assignPermissionsToRole,
  deleteRole,
  editRole
} from 'helpers/apiHelper';

import CreateRoleForm from './CreateRoleForm';
import RoleList from './RoleList';

const RolePage = () => {
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedRoleForPermission, setSelectedRoleForPermission] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedRoleName, setEditedRoleName] = useState('');

  useEffect(() => {
    loadRoles();
    loadUsers();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    const rolesData = await getRoles();
    setRoles(Array.isArray(rolesData) ? rolesData : []);
  };

  const loadUsers = async () => {
    const usersData = await getUsers();
    setUsers(Array.isArray(usersData) ? usersData : []);
  };

  const loadPermissions = async () => {
    const permissionsData = await getPermissions();
    setPermissions(Array.isArray(permissionsData) ? permissionsData : []);
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    await createRole(roleName);
    setRoleName('');
    loadRoles();
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setEditedRoleName(role.name);
    setEditMode(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;

    const response = await editRole(selectedRole.id, editedRoleName);
    if (response.success) {
      loadRoles();
      setEditMode(false);
      setSelectedRole(null);
      setEditedRoleName('');
    } else {
      alert(response.error);
    }
  };

  const handleDelete = async (roleId) => {
    await deleteRole(roleId);
    loadRoles();
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    await assignRoleToUser(selectedUser, selectedRole);
    setSelectedUser('');
    setSelectedRole('');
    alert('Role assigned to user!');
  };

  const handleAssignPermissions = async (e) => {
    e.preventDefault();
    await assignPermissionsToRole(selectedRoleForPermission, selectedPermissions);
    setSelectedPermissions([]);
    setSelectedRoleForPermission('');
    alert('Permissions assigned to role!');
  };

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Role Management</h1>

      <CreateRoleForm
        roleName={roleName}
        setRoleName={setRoleName}
        handleCreateRole={handleCreateRole}
      />

      {editMode && (
        <form onSubmit={handleUpdateRole} style={{ marginBottom: '2rem' }}>
          <h2>Edit Role</h2>
          <input
            type="text"
            value={editedRoleName}
            onChange={(e) => setEditedRoleName(e.target.value)}
            placeholder="Enter new role name"
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Update Role
          </button>
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setSelectedRole(null);
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ccc',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginLeft: '1rem'
            }}
          >
            Cancel
          </button>
        </form>
      )}

      <RoleList roles={roles} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default RolePage;
