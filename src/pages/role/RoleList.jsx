import React from 'react';

const RoleList = ({ roles, onEdit, onDelete }) => (
  <div style={styles.roleList}>
    <h2>Existing Roles</h2>
    {roles.length > 0 ? (
      <ul style={styles.list}>
        {roles.map((role) => (
          <li key={role.id} style={styles.roleItem}>
            <span style={styles.roleName}>{role.name}</span>
            <div style={styles.actions}>
              <button
                onClick={() => onEdit(role)}
                style={{ ...styles.button, ...styles.editBtn }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(role.id)}
                style={{ ...styles.button, ...styles.deleteBtn }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No roles found.</p>
    )}
  </div>
);

const styles = {
  roleList: {
    marginTop: '2rem',
    padding: '1.5rem',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  roleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #eee',
  },
  roleName: {
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  button: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  editBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    color: 'white',
  },
};

export default RoleList;
