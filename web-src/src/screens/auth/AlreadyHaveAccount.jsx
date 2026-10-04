// "Already have an account / Click Here" footer shared by ForgotPassword and VerifyOTP.
import React from 'react';
import { COLORS } from '../../constants';

const AlreadyHaveAccount = ({ onPress }) => (
  <div className="column" style={{ marginTop: 30, marginBottom: 20, fontSize: 'min(18px, 5.2vw)' }}>
    <span style={{ color: COLORS.dark, marginRight: 5 }}>Already have an account </span>
    <button type="button" className="touchable row" style={{ justifyContent: 'center' }} onClick={onPress}>
      <span
        style={{
          borderBottom: `1px solid ${COLORS.dark}`,
          width: '50%',
          color: COLORS.dark,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Click Here
      </span>
    </button>
  </div>
);

export default AlreadyHaveAccount;
