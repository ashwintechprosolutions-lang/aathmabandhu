import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Field from '../../components/Field';
import LoginButton from '../../components/LoginButton';
import { useAlert } from '../../components/Alert';
import AlreadyHaveAccount from './AlreadyHaveAccount';
import Logo from '../../components/Logo';
import { COLORS, ROUTES } from '../../constants';
import { useStore } from '../../store';
import api from '../../api/client';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { alert } = useAlert();
  const { setForgotPasswordEmail } = useStore();
  const [email, onChangeText] = useState('');

  async function forgotPasswordFun() {
    if (email !== '') {
      try {
        const response = await api.post('/auth/ForgotPassword', { email });
        alert(' ', response.data.message);
        setForgotPasswordEmail(email);
        navigate(ROUTES.VERIFY_OTP);
      } catch (error) {
        console.log(error);
        if (error.response?.data?.message) alert(' ', error.response.data.message);
      }
    } else {
      alert(' ', 'Please enter email');
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
          <span style={{ color: COLORS.dark, fontSize: 18, fontWeight: 'bold' }}>Forgot Password</span>
        </div>
        <div className="column" style={{ width: '100%', marginBottom: 30, alignItems: 'center' }}>
          <Field value={email} onChangeText={onChangeText} placeholder="" keyboardType="email-address" aria-label="Email" autoComplete="email" />
        </div>

        <LoginButton btnLabel="Send Otp" Press={forgotPasswordFun} />
        <AlreadyHaveAccount onPress={() => navigate(ROUTES.LOGIN)} />
        <button type="submit" hidden aria-hidden="true" />
      </form>
    </div>
  );
};

export default ForgotPassword;
