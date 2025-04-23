// src/pages/role/RolePermissions.jsx
import React, { useState, useEffect } from 'react';
import { Checkbox, Row, Col, Typography } from 'antd';

const { Title } = Typography;

const RolePermissions = ({ permissions, selectedPermissions, onChange }) => {
  const [groups, setGroups] = useState({});

  useEffect(() => {
    // Group by resource name (everything after the first underscore)
    const grouped = permissions.reduce((acc, perm) => {
      const [action, ...rest] = perm.codename.split('_');
      const resource = rest.join('_');
      if (!acc[resource]) acc[resource] = {};
      // store as strings for Checkbox value
      acc[resource][action] = String(perm.id);
      return acc;
    }, {});
    setGroups(grouped);
  }, [permissions]);

  const handleResourceSelectAll = (resource) => {
    const permIds = Object.values(groups[resource]);
    const allSelected = permIds.every(id => selectedPermissions.includes(id));
    let updated = [...selectedPermissions];
    if (allSelected) {
      // remove them
      updated = updated.filter(id => !permIds.includes(id));
    } else {
      // add them
      updated = Array.from(new Set(updated.concat(permIds)));
    }
    onChange(updated);
  };

  return (
    <div>
      {Object.entries(groups).map(([resource, actions]) => (
        <div key={resource} style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={5}>
                {resource.charAt(0).toUpperCase() + resource.slice(1)}
              </Title>
            </Col>
            <Col>
              <Checkbox
                indeterminate={
                  !Object.values(actions).every(id => selectedPermissions.includes(id)) &&
                  Object.values(actions).some(id => selectedPermissions.includes(id))
                }
                checked={Object.values(actions).every(id => selectedPermissions.includes(id))}
                onChange={() => handleResourceSelectAll(resource)}
              >
                Select All
              </Checkbox>
            </Col>
          </Row>

          <Checkbox.Group
            value={selectedPermissions}
            onChange={onChange}
            style={{ width: '100%' }}
          >
            <Row gutter={[16, 16]}>
              {Object.entries(actions).map(([action, id]) => (
                <Col key={action}>
                  <Checkbox value={id}>
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      ))}
    </div>
  );
};

export default RolePermissions;
