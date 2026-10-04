import React from 'react';

const Textarea = ({ value, onChangeText, style, ...rest }) => (
  <textarea
    {...rest}
    className="rn-input"
    value={value ?? ''}
    onChange={(e) => onChangeText(e.target.value)}
    rows={4}
    style={{
      borderRadius: 15,
      fontSize: 'min(18px, 5.2vw)',
      border: '1px solid #9EB7DF',
      padding: 10,
      width: '80%',
      backgroundColor: 'white',
      boxShadow: '0 3px 5px rgba(0,0,0,0.25)',
      resize: 'vertical',
      fontFamily: 'inherit',
      ...style,
    }}
  />
);

export default Textarea;
