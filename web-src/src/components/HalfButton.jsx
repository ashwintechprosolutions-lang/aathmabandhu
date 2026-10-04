import React from 'react';

const HalfButton = ({ btnLabel, Press }) => (
  <button type="button" className="touchable" onClick={Press} style={{ padding: 0 }}>
    <div
      style={{
        background: 'linear-gradient(to bottom, #05BE9D, #70E2F3)',
        padding: 10,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ color: 'white', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}> {btnLabel}</span>
    </div>
  </button>
);

export default HalfButton;
