// Web stand-in for React Native's <TextInput>: accepts the RN props used by the
// app (onChangeText, keyboardType, secureTextEntry, placeholderTextColor).
import React from 'react';

const INPUT_TYPES = { 'email-address': 'email', numeric: 'text', 'phone-pad': 'tel' };
const INPUT_MODES = { 'email-address': 'email', numeric: 'numeric', 'phone-pad': 'tel' };

const TextInput = ({ value, onChangeText, keyboardType, secureTextEntry, placeholderTextColor, style, ...rest }) => (
  <input
    {...rest}
    className="rn-input"
    value={value ?? ''}
    onChange={(e) => onChangeText && onChangeText(e.target.value)}
    type={secureTextEntry ? 'password' : INPUT_TYPES[keyboardType] || 'text'}
    inputMode={INPUT_MODES[keyboardType]}
    style={{ '--placeholder-color': placeholderTextColor, ...style }}
  />
);

export default TextInput;
