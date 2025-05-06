import React, { useState, useEffect } from 'react';
import { editRole } from '../../helpers/apiHelper';
import Permission from './Permission';
import styles from './CreateRole.module.css';

const EditRole = ({ role, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setSelectedPermissions(role.permissions || []);
    }
  }, [role]);

  const handleNext = () => {
    if (!roleName.trim()) {
      alert('Role name is required.');
      return;
    }
    setStep(2);
  };

  const handleSavePermissions = async (permissions) => {
    const result = await editRole(role.id, roleName.trim(), permissions);
    if (!result.success) {
      alert(result.error || 'Failed to update role.');
      return;
    }
    onSubmit({ ...role, name: roleName.trim(), permissions });
  };

  const handleCancel = () => {
    setStep(1);
    onSubmit(null); // Close modal
  };

  if (!role) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={handleCancel}></div>
      <div className={styles.overlay}>
        <div className={styles.overlayHeader}>
          <h3 className={styles.title}>Edit Role</h3>
          <button className={styles.closeBtn} onClick={handleCancel}>✕</button>
        </div>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className={styles.input}
            />
            <div className={styles.flexRow}>
              <button
                onClick={handleNext}
                disabled={!roleName.trim()}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Next
              </button>
              <button
                onClick={handleCancel}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <Permission
            initialSelected={selectedPermissions}
            onSave={handleSavePermissions}
            onBack={() => setStep(1)}
          />
        )}
      </div>
    </>
  );
};

export default EditRole;
