import React from 'react';

const Button = ({ btnLabel, Press }) => (
  <button type="button" className="touchable" onClick={Press} style={{ width: '80%', padding: 0 }}>
    <div
      style={{
        background: 'linear-gradient(to bottom, #05BE9D, #70E2F3)',
        padding: 10,
        borderRadius: 20,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ color: 'white', textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}> {btnLabel}</span>
    </div>
  </button>
);

export default Button;
