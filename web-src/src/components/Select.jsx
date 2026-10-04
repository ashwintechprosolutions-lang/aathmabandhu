// Styled to match Field.jsx exactly (same box, radius, shadow) so a dropdown sits
// naturally next to the app's other form controls.
import React from 'react';
import { COLORS } from '../constants';

const Select = ({ value, onChange, options, placeholder, style, ...rest }) => (
  <select
    {...rest}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="rn-input"
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
      color: value ? COLORS.dark : '#9E9E9E',
      ...style,
    }}
  >
    {placeholder && (
      <option value="" disabled>
        {placeholder}
      </option>
    )}
    {options.map((o) => (
      <option key={o} value={o} style={{ color: COLORS.dark }}>
        {o}
      </option>
    ))}
  </select>
);

export default Select;
