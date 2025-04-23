// CreateRolePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRole, getPermissions } from 'helpers/apiHelper';
import { Button, Input, Checkbox, Space, message, Spin } from 'antd';

const CreateRolePage = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const groupPermissionsByModel = (perms) => {
    const grouped = {};
    perms.forEach((perm) => {
      const model = perm.content_type__model;
      const action = perm.codename.split('_')[0]; // add, change, delete, view
      grouped[model] = grouped[model] || {};
      grouped[model][action] = {
        label: perm.name,
        value: String(perm.id),
      };
    });
    return grouped;
  };

  const loadPermissions = async () => {
    try {
      const data = await getPermissions();
      setPermissions(groupPermissionsByModel(data));
    } catch {
      message.error('Failed to load permissions');
    }
  };

  const handlePermissionChange = (model, vals) => {
    setSelectedPermissions((prev) => ({ ...prev, [model]: vals }));
  };

  const handleSelectAllToggle = (model) => {
    const actions = Object.keys(permissions[model] || {});
    const allVals = actions.map((a) => permissions[model][a].value);

    const currently = selectedPermissions[model] || [];
    const allSelected = actions.every((a) => currently.includes(permissions[model][a].value));

    setSelectedPermissions((prev) => ({
      ...prev,
      [model]: allSelected ? [] : allVals,
    }));
  };

  const handleCreateRole = async () => {
    if (
      !roleName.trim() ||
      Object.values(selectedPermissions).flat().length === 0
    ) {
      message.error('Please enter a role name and select at least one permission');
      return;
    }

    setLoading(true);
    try {
      const payload = Object.values(selectedPermissions)
        .flat()
        .map(Number);

      await createRole({ name: roleName, permissions: payload });
      message.success('Role created successfully');
      navigate('/roles');
    } catch {
      message.error('Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Create Role</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Input
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />

        <div>
          <h4>Select Permissions</h4>
          {Object.entries(permissions).map(([model, actions]) => {
            const currently = selectedPermissions[model] || [];
            const actionKeys = Object.keys(actions);
            const allSelected = actionKeys.every((a) => currently.includes(actions[a].value));

            return (
              <div key={model} style={{ marginBottom: '1rem' }}>
                <h5 style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {model}
                  <Checkbox
                    indeterminate={
                      currently.length > 0 && !allSelected
                    }
                    checked={allSelected}
                    onChange={() => handleSelectAllToggle(model)}
                  >
                    {allSelected ? 'Unselect All' : 'Select All'}
                  </Checkbox>
                </h5>

                <Checkbox.Group
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
                  value={currently}
                  onChange={(vals) => handlePermissionChange(model, vals)}
                >
                  {['add', 'change', 'delete', 'view'].map((action) => {
                    const perm = actions[action];
                    return perm ? (
                      <Checkbox key={perm.value} value={perm.value}>
                        {action}
                      </Checkbox>
                    ) : null;
                  })}
                </Checkbox.Group>
              </div>
            );
          })}
        </div>

        <Button
          type="primary"
          onClick={handleCreateRole}
          loading={loading}
          disabled={loading}
        >
          {loading ? <Spin /> : 'Create Role'}
        </Button>
      </Space>
    </div>
  );
};

export default CreateRolePage;
