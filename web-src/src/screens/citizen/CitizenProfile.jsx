// PUT /user/updateUserProfile keys the update by aadhar_number and only accepts
// full_name and mobile - email and the Aadhaar number itself are not editable,
// matching the backend exactly. The login response doesn't include aadhar_number,
// so it's fetched here via GET /user/getUserDetails/:id (a real, existing route).
import React, { useEffect, useState } from 'react';
import { IMGS } from '../../constants';
import Field from '../../components/Field';
import LoginButton from '../../components/LoginButton';
import Spinner from '../../components/Spinner';
import { useAlert } from '../../components/Alert';
import { useStore } from '../../store';
import useApi from '../../hooks/useApi';
import api from '../../api/client';

const CitizenProfile = () => {
  const { alert } = useAlert();
  const { userId, userFullName, userMobile, updateProfile } = useStore();
  const { data: details, loading } = useApi(async () => {
    const r = await api.get(`/user/getUserDetails/${userId}`);
    return r.data.user?.[0] || null;
  }, [userId]);

  const [fullName, setFullName] = useState(userFullName || '');
  const [mobile, setMobile] = useState(String(userMobile || ''));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (details) {
      setFullName(details.full_name);
      setMobile(String(details.mobile));
    }
  }, [details]);

  async function save() {
    if (!fullName || !mobile) {
      alert(' ', 'Please enter your name and mobile number.');
      return;
    }
    setSaving(true);
    try {
      await api.put('/user/updateUserProfile', { aadhar_number: details.aadhar_number, full_name: fullName, mobile });
      updateProfile(fullName, mobile);
      alert(' ', 'Profile updated.');
    } catch (error) {
      console.log(error);
      alert(' ', 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner label="Loading profile…" />;

  return (
    <div className="scroll" style={{ paddingBottom: 24 }}>
      <div className="page-title-row">
        <span className="page-title">Profile</span>
      </div>
      <div className="column" style={{ alignItems: 'center', padding: '8px 20px 20px' }}>
        <img src={IMGS.PROFILE1} alt="" style={{ width: 92, height: 92, borderRadius: 46 }} />
        <div style={{ marginTop: 10, fontSize: 13, color: '#52514e' }}>
          {details?.email} · Aadhaar ending {String(details?.aadhar_number || '').slice(-4)}
        </div>
      </div>

      <form
        className="column"
        style={{ alignItems: 'center' }}
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="column" style={{ width: '100%', marginBottom: 18, alignItems: 'center' }}>
          <Field value={fullName} onChangeText={setFullName} placeholder="Full name" autoComplete="name" />
        </div>
        <div className="column" style={{ width: '100%', marginBottom: 18, alignItems: 'center' }}>
          <Field value={mobile} onChangeText={setMobile} placeholder="Mobile number" keyboardType="numeric" autoComplete="tel" />
        </div>
        <LoginButton btnLabel={saving ? 'Saving…' : 'Save Changes'} Press={save} />
        <button type="submit" hidden aria-hidden="true" />
      </form>
    </div>
  );
};

export default CitizenProfile;
