import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Field from '../../components/Field';
import LoginButton from '../../components/LoginButton';
import PasswordToggle from '../../components/PasswordToggle';
import { useAlert } from '../../components/Alert';
import AlreadyHaveAccount from './AlreadyHaveAccount';
import Logo from '../../components/Logo';
import { COLORS, ROUTES } from '../../constants';
import { useStore } from '../../store';
import api from '../../api/client';

// paddingLeft 45 on a 360px phone == field edge (10%) + 9px; kept proportional for narrow/fold screens.
const labelRow = { width: '100%', alignItems: 'flex-start', paddingLeft: 'calc(10% + 9px)' };
const labelText = { fontSize: 'min(18px, 5.2vw)', fontWeight: 'bold', color: COLORS.dark };

const VerifyOTP = () => {
  const navigate = useNavigate();
  const { alert } = useAlert();
  const { forgotPasswordEmail } = useStore();
  const [otp, setOtp] = useState('');
  const [password, onChangeNumber] = useState('');
  const [Confirmpassword, onChangeConfirmPassword] = useState('');
  const [showpassword, setshowpassword] = useState(false);
  const [showconfirmpassword, setshowconfirmpassword] = useState(false);

  async function forgotPasswordFun() {
    if (otp !== '' && password !== '') {
      if (password === Confirmpassword) {
        const obj = { email: forgotPasswordEmail, password, Cpassword: Confirmpassword, otp };
        try {
          const response = await api.post('/auth/verifyEmailOTP', obj);
          alert(' ', response.data.message);
          navigate(ROUTES.LOGIN);
        } catch (error) {
          console.log(error);
          if (error.response?.data?.message) alert(' ', error.response.data.message);
        }
      } else {
        alert(' ', 'The password and confirm password fields do not match. Please try again.');
      }
    } else {
      alert(' ', 'Please enter your OTP and password');
    }
  }

  return (
    <div className="screen scroll">
      <form
        className="column container"
        style={{ alignItems: 'center', justifyContent: 'center' }}
        onSubmit={(e) => {
          e.preventDefault();
          forgotPasswordFun();
        }}
      >
        <div className="column" style={{ width: '100%', alignItems: 'center' }}>
          <Logo color={COLORS.navy} width="100%" style={{ maxWidth: 320, marginBottom: 40, marginTop: 50 }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <span style={{ color: COLORS.dark, fontSize: 18, fontWeight: 'bold' }}>Reset Password</span>
        </div>

        <div className="column" style={labelRow}>
          <label htmlFor="otp-password" style={labelText}>Password</label>
        </div>
        <div className="column" style={{ width: '100%', marginBottom: 20, alignItems: 'center', position: 'relative' }}>
          <Field id="otp-password" value={password} onChangeText={onChangeNumber} placeholder="Password" secureTextEntry={!showpassword} autoComplete="new-password" />
          <PasswordToggle shown={showpassword} setShown={setshowpassword} />
        </div>

        <div className="column" style={labelRow}>
          <label htmlFor="otp-cpassword" style={labelText}>Confirm Password</label>
        </div>
        <div className="column" style={{ width: '100%', marginBottom: 20, alignItems: 'center', position: 'relative' }}>
          <Field
            id="otp-cpassword"
            value={Confirmpassword}
            onChangeText={onChangeConfirmPassword}
            placeholder="Confirm Password"
            secureTextEntry={!showconfirmpassword}
            autoComplete="new-password"
          />
          <PasswordToggle shown={showconfirmpassword} setShown={setshowconfirmpassword} />
        </div>

        <div className="column" style={labelRow}>
          <label htmlFor="otp-code" style={labelText}>OTP</label>
        </div>
        <div className="column" style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
          <Field id="otp-code" value={otp} onChangeText={setOtp} placeholder="OTP" keyboardType="numeric" autoComplete="one-time-code" />
        </div>

        <LoginButton btnLabel="Reset Password" Press={forgotPasswordFun} />
        <AlreadyHaveAccount onPress={() => navigate(ROUTES.LOGIN)} />
        <button type="submit" hidden aria-hidden="true" />
      </form>
    </div>
  );
};

export default VerifyOTP;
