import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Field from '../../components/Field';
import LoginButton from '../../components/LoginButton';
import PasswordToggle from '../../components/PasswordToggle';
import Logo from '../../components/Logo';
import { useAlert } from '../../components/Alert';
import { COLORS, ROUTES, USER_TYPES } from '../../constants';
import { useStore } from '../../store';
import api from '../../api/client';

// paddingLeft 45 on a 360px phone == field edge (10%) + 9px; kept proportional for narrow/fold screens.
const labelRow = { width: '100%', alignItems: 'flex-start', paddingLeft: 'calc(10% + 9px)' };
const labelText = { fontSize: 'min(18px, 5.2vw)', fontWeight: 'bold', color: COLORS.dark };

const Login = () => {
  const navigate = useNavigate();
  const { alert } = useAlert();
  const { login } = useStore();
  const [email, onChangeText] = useState('');
  const [password, onChangeNumber] = useState('');
  const [showpassword, setshowpassword] = useState(false);

  async function LoginFunction() {
    if (email !== '' && password !== '') {
      try {
        const response = await api.post('/auth/login', { email, password });
        // The backend's /auth/login already returns a token+profile for all three
        // roles (see authController.js: admin and citizen both come back through the
        // same `isAvailable` User branch, officers through `isAvailableAgent`). The
        // mobile app only ever checked `user_type_id === 2` and silently did nothing
        // otherwise; here every role lands on its own dashboard instead.
        login(response.data.token, response.data.data);
        const dest =
          response.data.data.user_type_id === USER_TYPES.ADMIN
            ? ROUTES.ADMIN
            : response.data.data.user_type_id === USER_TYPES.OFFICER
              ? ROUTES.OFFICER
              : ROUTES.HOME;
        navigate(dest, { replace: true });
      } catch (error) {
        console.log(error);
        if (error.response?.status === 400) {
          alert(' ', 'The email or password you entered is incorrect. Please try again');
        }
      }
    } else {
      alert(' ', 'Please enter your Email and Password');
    }
  }

  return (
    <div className="screen scroll">
      <form
        className="column container"
        style={{ alignItems: 'center' }}
        onSubmit={(e) => {
          e.preventDefault();
          LoginFunction();
        }}
      >
        <div className="column" style={{ width: '100%', alignItems: 'center' }}>
          <Logo color={COLORS.navy} width="100%" style={{ marginBottom: 40, marginTop: 50, maxWidth: 320 }} />
        </div>

        <div className="column" style={labelRow}>
          <label htmlFor="login-email" style={labelText}>Email</label>
        </div>
        <div className="column" style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
          <Field id="login-email" value={email} onChangeText={onChangeText} placeholder="" keyboardType="email-address" autoComplete="email" />
        </div>

        <div className="column" style={labelRow}>
          <label htmlFor="login-password" style={labelText}>Password</label>
        </div>
        <div className="column" style={{ width: '100%', alignItems: 'center', position: 'relative' }}>
          <Field id="login-password" value={password} onChangeText={onChangeNumber} placeholder="" secureTextEntry={!showpassword} autoComplete="current-password" />
          <PasswordToggle shown={showpassword} setShown={setshowpassword} />
        </div>

        <div className="column" style={{ alignItems: 'flex-end', width: '80%', paddingRight: 16, marginBottom: 30 }}>
          <button type="button" className="touchable" onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}>
            <span style={{ color: COLORS.dark, fontSize: 16, fontWeight: 'bold', marginTop: 10, display: 'block' }}>Forgot Password ?</span>
          </button>
        </div>

        <div className="column" style={{ width: '100%', alignItems: 'center' }}>
          <LoginButton btnLabel="Log In" Press={LoginFunction} />
        </div>

        <div className="row" style={{ marginTop: 70, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20, padding: '0 8px' }}>
          <span style={{ color: COLORS.dark, fontSize: 16, marginRight: 2 }}>{"Don't have an account? "}</span>
          <button type="button" className="touchable" onClick={() => navigate(ROUTES.SIGNUP)}>
            <span style={{ color: COLORS.dark, fontSize: 16, fontWeight: 'bold' }}>Sign Up</span>
          </button>
        </div>
        <button type="submit" hidden aria-hidden="true" />
      </form>
    </div>
  );
};

export default Login;
