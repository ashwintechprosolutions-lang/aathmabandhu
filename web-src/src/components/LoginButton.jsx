import React from 'react';

const LoginButton = ({ btnLabel, Press }) => (
  <button type="button" className="touchable btn-navy" onClick={Press} style={{ width: '80%', marginTop: 40, padding: 10 }}>
    <span style={{ color: 'white', textAlign: 'center', fontSize: 'min(24px, 7vw)', fontWeight: 'bold' }}> {btnLabel}</span>
  </button>
);

export default LoginButton;
