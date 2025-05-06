import React, { useState } from 'react';
import { createRole } from '../../helpers/apiHelper';
import Permission from './Permission';
import styles from './CreateRole.module.css';

const CreateRole = ({ onSubmit, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [roleName, setRoleName] = useState('');
  const [createdRole, setCreatedRole] = useState(null);

  const handleCreate = async () => {
    if (!roleName.trim()) {
      alert('Role name is required.');
      return;
    }
    const newRole = await createRole(roleName);
    if (!newRole) {
      alert('Failed to create role.');
      return;
    }
    setCreatedRole(newRole);
    setStep(2);
  };

  const handlePermissionsSave = (selectedPermissions) => {
    onSubmit({ ...createdRole, permissions: selectedPermissions });
    setRoleName('');
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles.overlay}>
        <div className={styles.overlayHeader}>
          <h3 className={styles.title}>Create Role</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
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
                onClick={handleCreate}
                disabled={!roleName.trim()}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Next
              </button>
              <button
                onClick={onClose}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <Permission
            onSave={handlePermissionsSave}
            onBack={() => setStep(1)}
          />
        )}
      </div>
    </>
  );
};

export default CreateRole;
