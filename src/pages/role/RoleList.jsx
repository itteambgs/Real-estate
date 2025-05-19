import React from 'react';
import { Table, Button, Popconfirm } from 'antd';

const RoleList = ({ roles, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, role) => (
        <>
          <Button
            type="link"
            onClick={() => onEdit(role)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this role?"
            onConfirm={() => onDelete(role.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={roles}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default RoleList;