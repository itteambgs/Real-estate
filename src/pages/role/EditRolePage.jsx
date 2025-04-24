import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoleById, updateRole, getPermissions } from 'helpers/apiHelper';
import {
  Button,
  Input,
  Checkbox,
  Space,
  message,
  Spin,
  Row,
  Col,
  Card,
} from 'antd';

const EditRolePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const perms = await getPermissions();
        const grouped = groupPermissionsByModel(perms);
        setPermissions(grouped);

        const roleData = await getRoleById(id);
        setRoleName(roleData.name || '');

        const initSel = {};
        perms.forEach((perm) => {
          const pid = String(perm.id);
          const model = perm.content_type__model;
          if (
            Array.isArray(roleData.permissions) &&
            roleData.permissions.includes(perm.id)
          ) {
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
    const grouped = {};
    perms.forEach((perm) => {
      const model = perm.content_type__model;
      const action = perm.codename.split('_')[0];
      grouped[model] = grouped[model] || {};
      grouped[model][action] = {
        label: perm.name,
        value: String(perm.id),
      };
    });
    return grouped;
  };

  const handlePermissionChange = (model, vals) => {
    setSelectedPermissions((prev) => ({ ...prev, [model]: vals }));
  };

  const handleSelectAllToggle = (model) => {
    const actionKeys = Object.keys(permissions[model] || {});
    const allVals = actionKeys.map((a) => permissions[model][a].value);

    const current = selectedPermissions[model] || [];
    const allSelected = actionKeys.every((a) =>
      current.includes(permissions[model][a].value)
    );

    setSelectedPermissions((prev) => ({
      ...prev,
      [model]: allSelected ? [] : allVals,
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
          <h2>Select Permissions</h2>
          <Row gutter={[16, 16]}>
            {Object.entries(permissions).map(([model, actions]) => {
              const current = selectedPermissions[model] || [];
              const actionKeys = Object.keys(actions);
              const allSelected = actionKeys.every((a) =>
                current.includes(actions[a].value)
              );
              const indeterminate = current.length > 0 && !allSelected;

              return (
                <Col xs={24} sm={24} md={12} lg={8} xl={6} key={model}>
                  <Card
                    title={
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          textTransform: 'capitalize',
                          fontWeight: 600,
                        }}
                      >
                        <span>{model}</span>
                        <Checkbox
                          indeterminate={indeterminate}
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
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
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
                  </Card>
                </Col>
              );
            })}
          </Row>
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
