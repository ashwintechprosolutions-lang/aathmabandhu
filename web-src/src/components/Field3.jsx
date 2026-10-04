import React from 'react';
import TextInput from './TextInput';

const Field3 = (props) => (
  <TextInput
    {...props}
    style={{
      borderRadius: 20,
      fontSize: 18,
      border: '1px solid #9EB7DF',
      paddingLeft: 10,
      paddingRight: 10,
      width: '80%',
      height: 35,
      boxShadow: '0 3px 5px rgba(0,0,0,0.25)',
      backgroundColor: 'white',
    }}
    placeholderTextColor="#3E5A68"
  />
);

export default Field3;
