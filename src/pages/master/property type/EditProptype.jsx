// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Form, Input, Button } from 'semantic-ui-react';
// import { updatePropertyType } from 'helpers/apiHelper'; // Adjust path if needed


// function EditProptype() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     code: '',
//     type_name: '',
//   });

//   // Prefill form data from route state
//   useEffect(() => {
//     if (location.state) {
//       setFormData({
//         code: location.state.code || '',
//         type_name: location.state.type_name || '',
//       });

//       console.log("ID:", location.state.id);
//       console.log("Code:", location.state.code);
//       console.log("Type Name:", location.state.type_name);
//     }
//   }, [location.state]);

//   // Handle form submit
//   const postData = async () => {
//     try {
//       const resp = await updatePropertyType(location.state.id, formData);
//       if (resp.success) {
//         console.log("Update successful:", resp.data);
//         navigate('/master/property-type'); // Redirect to listing page
//       } else {
//         console.error("Update failed:", resp.error);
//       }
//     } catch (error) {
//       console.error("Error updating property type:", error);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: '0 ', padding: '2rem' }}>
//       <Form onSubmit={postData}className='ui-form'>
//         <Form.Field required>
//           <label>Code</label>
//           <Input
//             value={formData.code}
//             onChange={(e) => setFormData({ ...formData, code: e.target.value })}
//             placeholder="Enter Type code"
//           />
//         </Form.Field>

//         <Form.Field required>
//           <label>Type</label>
//           <Input
//             value={formData.type_name}
//             onChange={(e) => setFormData({ ...formData, type_name: e.target.value })}
//             placeholder="Enter Type name"
//           />
//         </Form.Field>

//         <Button type="submit" primary>
//           Submit
//         </Button>
//       </Form>
//     </div>
//   );
// }

// export default EditProptype;



import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Card } from 'antd';
import { updatePropertyType } from 'helpers/apiHelper';

function EditProptype() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      form.setFieldsValue({
        code: location.state.code,
        type_name: location.state.type_name,
      });
    } else {
      message.error("No property type data provided for editing.");
      navigate('/master/property-type');
    }
  }, [location.state, form, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const resp = await updatePropertyType(location.state.id, values);
      if (resp.success) {
        message.success('Property type updated successfully');
        navigate('/master/property-type');
      } else {
        message.error('Failed to update property type');
      }
    } catch (error) {
      console.error('Error updating property type:', error);
      message.error('An error occurred during update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Edit Property Type"
      style={{
        maxWidth: 500,
        margin: '0',
        backgroundColor: 'transparent',
        border: 'none', // Removed the border line
      }}
    >
      <div style={{ textAlign: 'left' }}> {/* Left-align form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Please enter the code' }]}

          >
            <Input placeholder="Enter code" />
          </Form.Item>

          <Form.Item
            label="Property Type Name"
            name="type_name"
            rules={[{ required: true, message: 'Please enter the type name' }]}

          >
            <Input placeholder="Enter type name" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
}

export default EditProptype;

