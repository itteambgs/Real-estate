// unwanted page
import React, { useState, useEffect } from 'react';

const AddRoleForm = ({ roleName = '', onNext, isEdit }) => {
  const [name, setName] = useState(roleName);

  useEffect(() => {
    setName(roleName);
  }, [roleName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onNext(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="drawer-form">
      <input
        type="text"
        placeholder="Role name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit" className="submit-btn">
        {isEdit ? 'Next →' : 'Next →'}
      </button>
    </form>
  );
};

export default AddRoleForm;
