import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { getownership } from 'helpers/apiHelper';


const OwnershipType = () => {
  const [ownershipTypes, setOwnershipTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOwnershipTypes();
  }, []);

  const fetchOwnershipTypes = async () => {
    setLoading(true);
    const data = await getownership();
    setOwnershipTypes(data.results || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/ownership-types/${id}/`);
      message.success('Ownership type deleted');
      setOwnershipTypes((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      message.error('Failed to delete ownership type');
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    // Example: Navigate to edit form
    console.log(`Edit ownership type with ID: ${id}`);
    // navigate(`/ownership-types/edit/${id}`);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Code',
      dataIndex: 'code',
    },
    {
      title: 'Ownership Type',
      dataIndex: 'ownership_type',
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Button type="link"  onClick={() => handleEdit(record.id)} style={{ marginRight: 8 }}>
            Edit
          </Button>
       
          <Popconfirm
            title="Are you sure you want to delete this?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Ownership Type Management</h1>
      <Table
        dataSource={ownershipTypes}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default OwnershipType;
