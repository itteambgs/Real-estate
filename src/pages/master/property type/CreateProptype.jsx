// import React from 'react'
// //import { Form,Table, Button, Popconfirm, message } from 'antd';
// import {Form,Button} from 'semantic-ui-react'
// import {createPropertyType} from 'helpers/apiHelper';
// import { useState } from 'react';
// function CreateProptype() {
//   const [code ,setCode] = useState('');
//   const [type ,setType] = useState('');
//   const postData=async()=>{
//     try{
//     const data={code,type_name:type}
//     await createPropertyType(data);
//     console.log("Submitting data:", data);
//     alert('Property Type created successfully!');
//     setCode('');
//     setType('');
//   }catch(error){

//     console.log('Failed to create property type:', error);
    
//   }
//   }
//   return (
//     <div>
//       <Form>
//         <Form.Field>
//             <label >Code</label>
//             <input value={code} onChange={event =>setCode(event.target.value)} placeholder='Enter Type code ' />
//         </Form.Field>
//         <br />
//         <Form.Field>
//             <label >Type</label>
//             <input value={type}onChange={event => setType(event.target.value)} placeholder='Enter Type name ' />
//         </Form.Field>
//         <br />
//         <Button onClick={postData}>Submit</Button>
//       </Form>
//     </div>
//   )
// }

// export default CreateProptype
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { createPropertyType } from 'helpers/apiHelper';
import { useNavigate } from 'react-router-dom';
function CreateProptype() {
  const [code, setCode] = useState('');
  const [type, setType] = useState('');
  const Navigate = useNavigate();
  const postData = async () => {
    try {
      const data = { code, type_name: type };
      await createPropertyType(data);
      
      message.success('Property Type created successfully!');
      Navigate('/master/property-type/read/');
      
      setCode('');
      setType('');
    } catch (error) {
      console.error('Failed to create property type:', error);
      message.error('Error creating property type');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 ', padding: '2rem' }}>
      <h2>Create Property Type</h2>
      <Form layout="vertical" onFinish={postData}>
        <Form.Item label="Code" required>
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter Type code" />
        </Form.Item>
        <Form.Item label="Type" required>
          <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Enter Type name" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateProptype;
