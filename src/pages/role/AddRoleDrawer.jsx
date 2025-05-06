// unwanted file

import React, { useState, useEffect } from 'react';
import './AddRoleDrawer.css';
import AddRoleForm from './AddRoleForm';
import PermissionToggles from './PermissionToggles';
import { createRole, editRole } from '../../helpers/apiHelper'; // ✅ Add editRole

const AddRoleDrawer = ({ isOpen, onClose, onSubmit, role }) => {
  const [step, setStep] = useState('add');
  const [roleData, setRoleData] = useState({ name: '', permissions: [] });

  useEffect(() => {
    if (role) {
      setRoleData(role);
      setStep('add');
    } else {
      setRoleData({ name: '', permissions: [] });
      setStep('add');
    }
  }, [role]);

  const handleRoleSubmit = async (name) => {
    if (!name.trim()) {
      alert('Role name is required.');
      return;
    }

    let updatedRole = { name };

    if (!role) {
      const createdRole = await createRole(name);
      if (!createdRole) {
        alert('Failed to create role.');
        return;
      }
      updatedRole = { ...createdRole, permissions: [] };
    } else {
      const result = await editRole(role.id, name);
      if (!result.success) {
        alert(result.error || 'Failed to update role.');
        return;
      }
      updatedRole = { id: role.id, name, permissions: role.permissions || [] };
    }

    setRoleData(updatedRole);
    setStep('permissions');
  };

  const handlePermissionsSubmit = (permissions) => {
    const finalData = { ...roleData, permissions };
    onSubmit(finalData);
  };

  const handleTabClick = (targetStep) => {
    if (targetStep === 'permissions' && !roleData.name.trim()) {
      alert('Please fill out the Role Name before setting permissions.');
      return;
    }
    setStep(targetStep);
  };

  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-header">
        <h3>{role ? 'Edit Role' : 'Add Role'}</h3>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>

      <div className="tab-buttons">
        <button className={step === 'add' ? 'active' : ''} onClick={() => handleTabClick('add')}>
          Add Role
        </button>
        <button className={step === 'permissions' ? 'active' : ''} onClick={() => handleTabClick('permissions')}>
          Permissions
        </button>
      </div>

      {step === 'add' && (
        <AddRoleForm
          roleName={roleData.name}
          onNext={handleRoleSubmit}
          isEdit={!!role}
        />
      )}

      {step === 'permissions' && (
        <PermissionToggles
          selected={roleData.permissions}
          onSubmit={handlePermissionsSubmit}
        />
      )}
    </div>
  );
};

export default AddRoleDrawer;
