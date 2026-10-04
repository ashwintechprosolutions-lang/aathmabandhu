// The eye / eye-slash toggle overlaid on password fields (FontAwesome5 in the app).
import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordToggle = ({ shown, setShown }) => (
  <div style={{ position: 'absolute', right: 'calc(10% + 18px)', top: 12 }}>
    <button
      type="button"
      className="touchable"
      aria-label={shown ? 'Hide password' : 'Show password'}
      onClick={() => setShown(!shown)}
      style={{ padding: 0, display: 'flex' }}
    >
      {shown ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
    </button>
  </div>
);

export default PasswordToggle;
