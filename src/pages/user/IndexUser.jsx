import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../helpers/apiHelper';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const IndexUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data.results || []);
      setPagination({
        current: page,
        pageSize,
        total: data.results.length,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteUser(id);
      if (response.success) {
        message.success('User deleted successfully!');
        fetchUsers(pagination.current, pagination.pageSize);
      } else {
        message.error('Failed to delete user.');
      }
    } catch (error) {
      message.error('Error deleting user.');
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchUsers(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) =>
        is_active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: 'Superuser',
      dataIndex: 'is_superuser',
      key: 'is_superuser',
      render: (is_superuser) =>
        is_superuser ? (
          <Tag color="blue">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-user/${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Users List</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/add-user')}>
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
};

export default IndexUser;