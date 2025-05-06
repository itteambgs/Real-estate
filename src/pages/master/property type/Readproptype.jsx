// import React from 'react';
// import { Table, Button } from 'semantic-ui-react';
// import { useState, useEffect } from 'react';
// import { getPropertyType, deletePropertyType } from 'helpers/apiHelper';
// import { useNavigate } from 'react-router-dom';
// function Readproptype() {
//   const [propertyType, setPropertyType] = useState([]);
//   const navigate = useNavigate();
//   const deleteproptype = async (id) => {
//     try {
//       const resp = await deletePropertyType(id);
//       if (resp.success) {
//         fetchPropertyType(); 
//       } else {
//         console.error('Delete failed:', resp.error);
//       }
//     } catch (error) {
//       console.error('Error deleting property type:', error);
//     }
//   };
//   const updateproptype=(data)=>{
//     navigate('/master/property-type/edit/' + data.id, { state: data });

//   }

//   const fetchPropertyType = async () => {
//     try {
//       const resp = await getPropertyType();
//       console.log("API Response:", resp);
//       setPropertyType(resp.results || []);
//     } catch (error) {
//       console.error("Failed to fetch property types:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPropertyType();
//   }, []);

//   return (
//     <div>
//       <Button primary onClick={() => navigate('/master/property-type/create/')}>Add</Button>

//       <Table singleLine>
//         <Table.Header>
//           <Table.Row>
//             <Table.HeaderCell>Code</Table.HeaderCell>
//             <Table.HeaderCell>Property Type</Table.HeaderCell>
//             <Table.HeaderCell>Actions</Table.HeaderCell>
//           </Table.Row>
//         </Table.Header>

//         <Table.Body>
//           {propertyType.map(data => (
//             <Table.Row key={data.id}>
//               <Table.Cell>{data.code}</Table.Cell>
//               <Table.Cell>{data.type_name}</Table.Cell>
//               <Table.Cell>
//                 <Button color="red" onClick={() => deleteproptype(data.id)}>Delete</Button>
//                 <Button color="red" onClick={() => updateproptype(data)}>Update</Button>
//               </Table.Cell>
//             </Table.Row>
//           ))}
//         </Table.Body>
//       </Table>
//     </div>
//   );
// }

// export default Readproptype;

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message } from 'antd';
import { getPropertyType, deletePropertyType } from 'helpers/apiHelper';
import { useNavigate } from 'react-router-dom';

function Readproptype() {
  const [propertyType, setPropertyType] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPropertyType = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const resp = await getPropertyType(page, pageSize);
      setPropertyType(resp.results || []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: resp.count || 0,
      }));
    } catch (error) {
      message.error("Failed to load property types");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    fetchPropertyType(pagination.current, pagination.pageSize);
  };

  const deleteProptype = async (id) => {
    try {
      const resp = await deletePropertyType(id);
      if (resp.success) {
        message.success('Deleted successfully');
        fetchPropertyType(pagination.current, pagination.pageSize);
      } else {
        message.error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting property type:', error);
      message.error('Something went wrong while deleting');
    }
  };

  const updateProptype = (data) => {
    navigate(`/master/property-type/edit/${data.id}`, { state: data });
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Property Type',
      dataIndex: 'type_name',
      key: 'type_name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => updateProptype(record)}>Edit</Button>
          <Button danger type="link" onClick={() => deleteProptype(record.id)}>Delete</Button>
          
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchPropertyType(pagination.current, pagination.pageSize);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Property Type</h1>
      <Button
        type="primary"
        onClick={() => navigate('/master/property-type/create/')}
        style={{ marginBottom: 16, float: 'right' }} // Move the "Add" button to the right
      >
        Add
      </Button>
      <Table
        columns={columns}
        dataSource={propertyType}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        bordered={false} // Remove the table border lines
      />
    </div>
  );
}

export default Readproptype;
