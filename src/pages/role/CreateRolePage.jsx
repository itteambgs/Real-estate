import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRole, getPermissions } from 'helpers/apiHelper';
import { Button, Input, Checkbox, Space, message, Spin, Row, Col, Card } from 'antd';

const CreateRolePage = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  // Group permissions by model from codename: "add_model", "change_model"
  const groupPermissionsByModel = (perms) => {
    const grouped = {};
    perms.forEach((perm) => {
      if (!perm.codename) return;
      const [action, ...modelParts] = perm.codename.split('_');
      if (!action || modelParts.length === 0) return;
      const model = modelParts.join('_');
      grouped[model] = grouped[model] || {};
      grouped[model][action] = {
        label: perm.name,
        value: String(perm.id),  // IDs as strings for checkboxes
      };
    });
    return grouped;
  };

  useEffect(() => {
    async function loadPermissions() {
      try {
        const perms = await getPermissions();
        setPermissions(groupPermissionsByModel(perms));
      } catch {
        message.error('Failed to load permissions');
      }
    }
    loadPermissions();
  }, []);

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
    if (!roleName.trim()) {
      message.error('Please enter a role name');
      return;
    }
    const selectedIds = Object.values(selectedPermissions).flat().map(Number).filter(id => !isNaN(id));
    if (selectedIds.length === 0) {
      message.error('Please select at least one permission');
      return;
    }

    setLoading(true);
    try {
      await createRole({ name: roleName, permissions: selectedIds });
      message.success('Role created successfully');
      navigate('/roles');
    } catch (error) {
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
          <h3>Select Permissions</h3>
          <Row gutter={[16, 16]}>
            {Object.entries(permissions).map(([model, actions]) => {
              const currently = selectedPermissions[model] || [];
              const actionKeys = Object.keys(actions);
              const allSelected = actionKeys.every((a) =>
                currently.includes(actions[a].value)
              );
              return (
                <Col xs={24} sm={24} md={12} lg={8} xl={6} key={model}>
                  <Card
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textTransform: 'capitalize', fontWeight: 600 }}>
                        <span>{model}</span>
                        <Checkbox
                          indeterminate={currently.length > 0 && !allSelected}
                          checked={allSelected}
                          onChange={() => handleSelectAllToggle(model)}
                        >
                          {allSelected ? 'Unselect All' : 'Select All'}
                        </Checkbox>
                      </div>
                    }
                    size="small"
                    style={{ height: '100%' }}
                  >
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
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
        <Button type="primary" onClick={handleCreateRole} loading={loading} disabled={loading}>
          {loading ? <Spin /> : 'Create Role'}
        </Button>
      </Space>
    </div>
  );
};

export default CreateRolePage;