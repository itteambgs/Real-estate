// src/components/RoleList.js

import React, { useState } from 'react';
import './RoleList.css';
import { deleteRole } from '../../helpers/apiHelper'; // ✅ Import API

const RoleList = ({ roles, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = roles.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(roles.length / rowsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this role?');
    if (!confirmDelete) return;

    const result = await deleteRole(id);
    if (result.success) {
      onDelete(id); // update UI in parent
    } else {
      alert(result.error || 'Failed to delete role');
    }
  };

  return (
    <div className="table-container">
      <h2>Role List</h2>
      <table className="role-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Role Name</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-data">No roles found</td>
            </tr>
          ) : (
            currentRows.map((role, index) => (
              <tr key={role.id}>
                <td>{indexOfFirstRow + index + 1}</td>
                <td>{role.name}</td>
                <td>
                  <button className="edit-btn" onClick={() => onEdit(role)}>Edit</button>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(role.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {roles.length > rowsPerPage && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => handlePageClick(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default RoleList;
