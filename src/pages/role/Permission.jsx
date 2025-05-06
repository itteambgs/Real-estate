import React, { useEffect, useState } from 'react';
import { getPermissions } from '../../helpers/apiHelper';

const Permission = ({ onSave, onBack, initialSelected = [] }) => {
  const [permissions, setPermissions] = useState([]);
  const [selected, setSelected] = useState(initialSelected);

  useEffect(() => {
    const fetchPermissions = async () => {
      const data = await getPermissions();
      setPermissions(data);
    };
    fetchPermissions();
  }, []);

  const togglePermission = (permId) => {
    if (selected.includes(permId)) {
      setSelected(selected.filter(p => p !== permId));
    } else {
      setSelected([...selected, permId]);
    }
  };

  return (
    <div>
      <h3>Assign Permissions</h3>
      {permissions.length === 0 ? (
        <p>Loading permissions...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
          {permissions.map((perm) => (
            <li key={perm.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selected.includes(perm.id)}
                  onChange={() => togglePermission(perm.id)}
                />
                {perm.name}
              </label>
            </li>
          ))}
        </ul>
      )}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button onClick={onBack}>Back</button>
        <button onClick={() => onSave(selected)}>Save Permissions</button>
      </div>
    </div>
  );
};

export default Permission;
