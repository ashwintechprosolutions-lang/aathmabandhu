// PUT /supervisor/updateSupervisorProfile - same shape as the agent's profile
// update, keyed by aadhar_number, only full_name/mobile editable. monitors_sector
// is fixed by the backend (set at createSupervisor, never updated), shown read-only.
import React, { useEffect, useState } from 'react';
import { IMGS } from '../../constants';
import Field from '../../components/Field';
import LoginButton from '../../components/LoginButton';
import Spinner from '../../components/Spinner';
import { useAlert } from '../../components/Alert';
import { useStore } from '../../store';
import useApi from '../../hooks/useApi';
import api from '../../api/client';

const SupervisorProfile = () => {
  const { alert } = useAlert();
  const { supervisorId, userFullName, userMobile, monitorsSector, updateProfile } = useStore();
  const { data: details, loading } = useApi(async () => {
    const r = await api.get(`/supervisor/getSupervisorDetails/${supervisorId}`);
    return r.data.supervisor || null;
  }, [supervisorId]);

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
      await api.put('/supervisor/updateSupervisorProfile', { aadhar_number: details.aadhar_number, full_name: fullName, mobile });
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
          {details?.email} · {monitorsSector || 'All departments'}
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

export default SupervisorProfile;
