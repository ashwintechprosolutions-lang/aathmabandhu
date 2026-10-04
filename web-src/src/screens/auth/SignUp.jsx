import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Field from '../../components/Field';
import LoginButton from '../../components/LoginButton';
import PasswordToggle from '../../components/PasswordToggle';
import Logo from '../../components/Logo';
import { useAlert } from '../../components/Alert';
import { COLORS, ROUTES } from '../../constants';
import { aadharData } from '../../api/dummyData';
import api from '../../api/client';

// paddingLeft 45 on a 360px phone == field edge (10%) + 9px; kept proportional for narrow/fold screens.
const labelRow = { width: '100%', alignItems: 'flex-start', paddingLeft: 'calc(10% + 9px)' };
const labelText = { fontSize: 'min(18px, 5.2vw)', fontWeight: 'bold', color: COLORS.dark };
const fieldRow = { width: '100%', marginBottom: 20, alignItems: 'center' };

const SignUp = () => {
  const navigate = useNavigate();
  const { alert } = useAlert();
  const [Name, onChangeName] = useState('');
  const [aadharNumber, onChangeAadharNumber] = useState('');
  const [email, onChangeText] = useState('');
  const [password, onChangeNumber] = useState('');
  const [Confirmpassword, onChangeConfirmPassword] = useState('');
  const [mobile, onChangeMobile] = useState('');
  const [showpassword, setshowpassword] = useState(false);
  const [showconfirmpassword, setshowconfirmpassword] = useState(false);

  // "Verify" looks the Aadhaar number up in the mock registry and pre-fills name + mobile.
  function verifyAadhar() {
    aadharData.forEach((data) => {
      if (String(data.aadharNumber) === aadharNumber.replace(/[\s-]/g, '')) {
        onChangeName(data.fullName);
        onChangeMobile(data.phone);
      }
    });
  }

  async function SignUpFunction() {
    if (email !== '' && mobile !== '' && Name !== '' && aadharNumber !== '' && Confirmpassword !== '' && password !== '') {
      if (password === Confirmpassword) {
        const obj = {
          email,
          password,
          Cpassword: Confirmpassword,
          user_type_id: 2,
          full_name: Name,
          aadhar_number: aadharNumber,
          mobile,
        };
        try {
          await api.post('/auth/signUp', obj);
          alert(' ', 'SignUp Successfull');
          navigate(ROUTES.LOGIN);
        } catch (error) {
          console.log(error);
          if (error.response?.status === 400) {
            alert(' ', 'Email Already in Use');
          }
        }
      } else {
        alert(' ', 'The password and confirm password fields do not match. Please try again.');
      }
    } else {
      alert(' ', 'Please enter all the fields.');
    }
  }

  return (
    <div className="screen scroll">
      <form
        className="column container"
        style={{ alignItems: 'center' }}
        onSubmit={(e) => {
          e.preventDefault();
          SignUpFunction();
        }}
      >
        <Logo color={COLORS.navy} width={256} style={{ maxWidth: '90%', marginBottom: 10 }} />

        <span style={{ color: COLORS.dark, fontSize: 'min(28px, 8vw)', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
          Create Your Account
        </span>

        <div className="column" style={labelRow}>
          <label htmlFor="su-aadhar" style={labelText}>Aadhar Number</label>
        </div>
        <div className="column" style={{ position: 'relative', width: '100%' }}>
          <div className="column" style={fieldRow}>
            <Field id="su-aadhar" value={aadharNumber} onChangeText={onChangeAadharNumber} placeholder="Aadhar Number" />
          </div>
          <button
            type="button"
            className="touchable"
            onClick={verifyAadhar}
            style={{
              position: 'absolute',
              right: '10%',
              top: 0,
              backgroundColor: COLORS.navy,
              height: 45,
              width: 60,
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: COLORS.primary, fontWeight: 'bold' }}>Verify</span>
          </button>
        </div>

        <div className="column" style={labelRow}>
          <label htmlFor="su-name" style={labelText}>Full Name</label>
        </div>
        <div className="column" style={fieldRow}>
          <Field id="su-name" value={Name} onChangeText={onChangeName} placeholder="Name" autoComplete="name" />
        </div>

        <div className="column" style={labelRow}>
          <label htmlFor="su-mobile" style={labelText}>Mobile Number</label>
        </div>
        <div className="column" style={fieldRow}>
          <Field id="su-mobile" value={mobile} onChangeText={onChangeMobile} placeholder="Mobile Number" keyboardType="numeric" autoComplete="tel" />
        </div>

        <div className="column" style={labelRow}>
          <label htmlFor="su-email" style={labelText}>Email</label>
        </div>
        <div className="column" style={fieldRow}>
          <Field id="su-email" value={email} onChangeText={onChangeText} placeholder="Email" keyboardType="email-address" autoComplete="email" />
        </div>

        <div className="column" style={labelRow}>
          <label htmlFor="su-password" style={labelText}>Password</label>
        </div>
        <div className="column" style={{ ...fieldRow, position: 'relative' }}>
          <Field id="su-password" value={password} onChangeText={onChangeNumber} placeholder="Password" secureTextEntry={!showpassword} autoComplete="new-password" />
          <PasswordToggle shown={showpassword} setShown={setshowpassword} />
        </div>

        <div className="column" style={labelRow}>
          <label htmlFor="su-cpassword" style={labelText}>Confirm Password</label>
        </div>
        <div className="column" style={{ width: '100%', alignItems: 'center', position: 'relative' }}>
          <Field
            id="su-cpassword"
            value={Confirmpassword}
            onChangeText={onChangeConfirmPassword}
            placeholder="Confirm Password"
            secureTextEntry={!showconfirmpassword}
            autoComplete="new-password"
          />
          <PasswordToggle shown={showconfirmpassword} setShown={setshowconfirmpassword} />
        </div>

        <LoginButton btnLabel="SignUp" Press={SignUpFunction} />

        <div className="row" style={{ justifyContent: 'center', marginTop: 30, marginBottom: 20 }}>
          <span style={{ marginRight: 5 }}>Already have an account ?</span>
          <button type="button" className="touchable" onClick={() => navigate(ROUTES.LOGIN)}>
            <span style={{ color: COLORS.dark, fontWeight: 'bold' }}>Login</span>
          </button>
        </div>
        <button type="submit" hidden aria-hidden="true" />
      </form>
    </div>
  );
};

export default SignUp;
