import React from 'react';

const AssignRoleForm = ({
  users,
  roles,
  selectedUser,
  setSelectedUser,
  selectedRoles,
  setSelectedRoles,
  handleAssignRole,
}) => {
  const handleRoleChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setSelectedRoles(selectedOptions);
  };

  return (
    <form
      onSubmit={handleAssignRole}
      style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        margin: '2rem auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Assign Role(s) to User</h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="user-select" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
          Select User
        </label>
        <select
          id="user-select"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '1rem',
          }}
        >
          <option value="">-- Choose User --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="role-select" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
          Select Role(s)
        </label>
        <select
          id="role-select"
          multiple
          value={selectedRoles}
          onChange={handleRoleChange}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '1rem',
            height: '150px',
          }}
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#007bff',
          color: '#fff',
          fontSize: '1rem',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
      >
        Assign Role(s)
      </button>
    </form>
  );
};

export default AssignRoleForm;
