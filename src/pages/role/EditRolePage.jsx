// EditRolePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoleById, updateRole, getPermissions } from 'helpers/apiHelper';
import { Button, Input, Checkbox, Space, message, Spin } from 'antd';

const EditRolePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState({});              // grouped perms by model
  const [selectedPermissions, setSelectedPermissions] = useState({}); // { model: [ids] }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) fetch all permissions
        const perms = await getPermissions();
        // 2) group by model→action
        const grouped = groupPermissionsByModel(perms);
        setPermissions(grouped);

        // 3) fetch role
        const roleData = await getRoleById(id);
        setRoleName(roleData.name || '');

        // 4) init selected per model
        const initSel = {};
        perms.forEach((perm) => {
          const pid = String(perm.id);
          const model = perm.content_type__model;
          if (Array.isArray(roleData.permissions) && roleData.permissions.includes(perm.id)) {
            initSel[model] = initSel[model] || [];
            initSel[model].push(pid);
          }
        });
        setSelectedPermissions(initSel);
      } catch (err) {
        console.error(err);
        message.error('Failed to load role or permissions');
      }
    };
    loadData();
  }, [id]);

  const groupPermissionsByModel = (perms) => {
    const g = {};
    perms.forEach((perm) => {
      const model = perm.content_type__model;
      const action = perm.codename.split('_')[0]; // add/change/delete/view
      g[model] = g[model] || {};
      g[model][action] = {
        label: perm.name,
        value: String(perm.id),
      };
    });
    return g;
  };

  // toggle select/unselect all for a model
  const handleSelectAllToggle = (model) => {
    const actionKeys = Object.keys(permissions[model] || {});
    const allVals = actionKeys.map((a) => permissions[model][a].value);
    const current = selectedPermissions[model] || [];
    const allSelected = actionKeys.every((a) => current.includes(permissions[model][a].value));

    setSelectedPermissions((prev) => ({
      ...prev,
      [model]: allSelected ? [] : allVals,
    }));
  };

  // update selected for one model
  const handlePermissionChange = (model, vals) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [model]: vals,
    }));
  };

  const handleUpdateRole = async () => {
    if (!roleName.trim() || Object.values(selectedPermissions).flat().length === 0) {
      message.error('Please enter a role name and select at least one permission');
      return;
    }
    setLoading(true);
    try {
      const allIds = Object.values(selectedPermissions)
        .flat()
        .map(Number);
      await updateRole(id, { name: roleName, permissions: allIds });
      message.success('Role updated successfully');
      navigate('/roles');
    } catch (err) {
      console.error(err);
      message.error('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Edit Role</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Input
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />

        <div>
          <h4>Select Permissions</h4>
          {Object.entries(permissions).map(([model, actions]) => {
            const current = selectedPermissions[model] || [];
            const actionKeys = Object.keys(actions);
            const allSelected = actionKeys.every((a) => current.includes(actions[a].value));
            const indeterminate = current.length > 0 && !allSelected;

            return (
              <div key={model} style={{ marginBottom: '1rem' }}>
                <h5
                  style={{
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {model}
                  <Checkbox
                    indeterminate={indeterminate}
                    checked={allSelected}
                    onChange={() => handleSelectAllToggle(model)}
                  >
                    {allSelected ? 'Unselect All' : 'Select All'}
                  </Checkbox>
                </h5>

                <Checkbox.Group
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
                  value={current}
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
          onClick={handleUpdateRole}
          loading={loading}
          disabled={loading}
        >
          {loading ? <Spin /> : 'Update Role'}
        </Button>
      </Space>
    </div>
  );
};

export default EditRolePage;
