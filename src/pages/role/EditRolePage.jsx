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
  const [permissions, setPermissions] = useState({});         // grouped perms
  const [selectedPermissions, setSelectedPermissions] = useState({}); // model → [value]
  const [loading, setLoading] = useState(false);

  // Group raw permissions by model/action
  const groupPermissionsByModel = (perms) => {
    const grouped = {};
    perms.forEach((perm) => {
      if (!perm.codename) return;
      const parts = perm.codename.split('_');
      if (parts.length < 2) return;
      const action = parts[0];
      const model = parts.slice(1).join('_');
      grouped[model] = grouped[model] || {};
      grouped[model][action] = {
        label: perm.name,
        value: String(perm.id),
      };
    });
    return grouped;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fetch all permissions and group them
        const perms = await getPermissions();
        const grouped = groupPermissionsByModel(perms);
        setPermissions(grouped);

        // 2. Fetch the role data
        const roleData = await getRoleById(id);
        setRoleName(roleData.name || '');

        // Debug: uncomment to verify shapes
        // console.log('roleData:', roleData);
        // console.log('grouped perms:', grouped);

        // 3. Initialize selectedPermissions by looping grouped
        const initSel = {};
        Object.entries(grouped).forEach(([model, actions]) => {
          Object.values(actions).forEach((permObj) => {
            // only mark selected if roleData.permissions is an array and includes this perm.id
            if (
  Array.isArray(roleData.permissions) &&
  roleData.permissions.includes(permObj.value * 1)  // force to number
) {

              initSel[model] = initSel[model] || [];
              initSel[model].push(permObj.value);
            }
          });
        });
        setSelectedPermissions(initSel);
      } catch (err) {
        console.error(err);
        message.error('Failed to load role or permissions');
      }
    };
    loadData();
  }, [id]);

  const handlePermissionChange = (model, vals) => {
    setSelectedPermissions((prev) => ({ ...prev, [model]: vals }));
  };

  const handleSelectAllToggle = (model) => {
    const actions = Object.values(permissions[model] || {});
    const allVals = actions.map((p) => p.value);
    const current = selectedPermissions[model] || [];
    const allSelected = allVals.every((val) => current.includes(val));
    setSelectedPermissions((prev) => ({
      ...prev,
      [model]: allSelected ? [] : allVals,
    }));
  };

  const handleUpdateRole = async () => {
    if (!roleName.trim()) {
      message.error('Please enter a role name');
      return;
    }
    const allIds = Object.values(selectedPermissions).flat().map(Number);
    if (allIds.length === 0) {
      message.error('Select at least one permission');
      return;
    }
    setLoading(true);
    try {
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
          <h3>Select Permissions</h3>
          <Row gutter={[16, 16]}>
            {Object.entries(permissions).map(([model, actions]) => {
              const current = selectedPermissions[model] || [];
              const allVals = Object.values(actions).map((p) => p.value);
              const allSelected = allVals.every((v) => current.includes(v));
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
                        <span>{model.replace(/_/g, ' ')}</span>
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
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
                      value={current}
                      onChange={(vals) => handlePermissionChange(model, vals)}
                    >
                      {['add', 'change', 'delete', 'view'].map((action) => {
                        const permObj = actions[action];
                        return permObj ? (
                          <Checkbox key={permObj.value} value={permObj.value}>
                            {action.charAt(0).toUpperCase() + action.slice(1)}
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

        <Button type="primary" onClick={handleUpdateRole} loading={loading} disabled={loading}>
          {loading ? <Spin /> : 'Update Role'}
        </Button>
      </Space>
    </div>
  );
};

export default EditRolePage;