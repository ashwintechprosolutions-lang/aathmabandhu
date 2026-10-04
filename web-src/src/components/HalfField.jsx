import React from 'react';
import TextInput from './TextInput';

const HalfField = (props) => (
  <TextInput
    {...props}
    style={{
      borderRadius: 15,
      fontSize: 18,
      border: '1px solid #9EB7DF',
      paddingLeft: 10,
      paddingRight: 10,
      width: '100%',
      height: 45,
      backgroundColor: 'white',
      boxShadow: '0 3px 5px rgba(0,0,0,0.25)',
    }}
    placeholderTextColor="#9EB7DF"
  />
);

export default HalfField;
