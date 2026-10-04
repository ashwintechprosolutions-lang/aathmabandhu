import React from 'react';
import TextInput from './TextInput';
import { COLORS } from '../constants';

const Field = ({ style, ...props }) => (
  <TextInput
    {...props}
    style={{
      borderRadius: 15,
      fontSize: 'min(18px, 5.2vw)',
      border: '1px solid #9EB7DF',
      paddingLeft: 10,
      paddingRight: 10,
      width: '80%',
      height: 45,
      backgroundColor: 'white',
      boxShadow: '0 3px 5px rgba(0,0,0,0.25)',
      ...style,
    }}
    placeholderTextColor={COLORS.dark}
  />
);

export default Field;
