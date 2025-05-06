import React, { useEffect, useState } from 'react';
import {
  GlobalOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  BankOutlined,
  FileTextOutlined,
  TeamOutlined,
  ApartmentOutlined,
  FileDoneOutlined,
  DownOutlined,
  RightOutlined
} from '@ant-design/icons';

const icons = {
  GlobalOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  BankOutlined,
  FileTextOutlined,
  TeamOutlined,
  ApartmentOutlined,
  FileDoneOutlined
};

const masterTables = [
  { id: 'properties', name: 'Properties', icon: 'HomeOutlined' },
  { id: 'countries', name: 'Countries', icon: 'GlobalOutlined' },
  { id: 'states', name: 'States', icon: 'EnvironmentOutlined' },
  { id: 'cities', name: 'Cities', icon: 'BankOutlined' },
  { id: 'ownership-type', name: 'Ownership Type', icon: 'TeamOutlined' },
  { id: 'bhk-type', name: 'BHK Type', icon: 'ApartmentOutlined' },
  { id: 'property-type', name: 'Property Type', icon: 'FileDoneOutlined' },
  { id: 'document-type', name: 'Document Type', icon: 'FileTextOutlined' }
];

const CRUD_OPTIONS = ['add', 'edit', 'delete', 'view', 'all'];

const PermissionToggles = ({ selected = [], onSubmit }) => {
  const [checked, setChecked] = useState(selected);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setChecked(selected);
  }, [selected]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleChecked = (id) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleParentClick = (id) => {
    toggleExpand(id);
  };

  const handleAllToggle = (baseId) => {
    const baseCRUDIds = CRUD_OPTIONS.slice(0, 4).map(op => `${baseId}_${op}`);
    const isAllChecked = baseCRUDIds.every(id => checked.includes(id));
    setChecked(prev => {
      const withoutAll = prev.filter(id => !baseCRUDIds.includes(id));
      return isAllChecked ? withoutAll : [...withoutAll, ...baseCRUDIds];
    });
  };

  // This will check/uncheck all CRUD options based on individual checkboxes
  const handleIndividualToggle = (id) => {
    const isChecked = checked.includes(id);
    if (isChecked) {
      setChecked((prev) => prev.filter((item) => item !== id));
    } else {
      setChecked((prev) => [...prev, id]);
    }
  };

  const handleSave = () => {
    onSubmit(checked);
  };

  return (
    <div className="permission-list">
      <h3>Role Permissions</h3>
      {masterTables.map((perm) => {
        const Icon = icons[perm.icon];
        const isExpanded = expanded[perm.id];
        const crudIds = CRUD_OPTIONS.map((op) => `${perm.id}_${op}`);
        const crudChecked = crudIds.map((id) => checked.includes(id));

        return (
          <div key={perm.id} style={{ marginBottom: '10px' }}>
            <div
              onClick={() => handleParentClick(perm.id)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '5px',
                fontWeight: 'bold'
              }}
            >
              {isExpanded ? <DownOutlined /> : <RightOutlined />}
              <Icon style={{ marginLeft: '10px', marginRight: '8px' }} />
              <span>{perm.name}</span>
            </div>

            {isExpanded && (
              <div style={{ marginLeft: '30px' }}>
                {CRUD_OPTIONS.map((op, index) => {
                  const id = `${perm.id}_${op}`;
                  return (
                    <label key={id} style={{ display: 'block', marginBottom: '6px' }}>
                      <input
                        type="checkbox"
                        checked={checked.includes(id)}
                        onChange={() =>
                          op === 'all' ? handleAllToggle(perm.id) : handleIndividualToggle(id)
                        }
                        style={{ marginRight: '8px' }}
                      />
                      {op === 'all' ? 'All' : op.charAt(0).toUpperCase() + op.slice(1)}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      <button className="submit-btn" onClick={handleSave}>
        Save & Finish
      </button>
    </div>
  );
};

export default PermissionToggles;
