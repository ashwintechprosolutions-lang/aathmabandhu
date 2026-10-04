// PUT /agent/updateAgentProfile: same shape as the citizen's updateUserProfile,
// keyed by aadhar_number, only full_name/mobile editable. agent_sector is fixed by
// the backend (set at createAgent, never updated), shown here read-only.
import React, { useEffect, useState } from 'react';
import { IMGS } from '../../constants';
import Field from '../../components/Field';
import LoginButton from '../../components/LoginButton';
import Spinner from '../../components/Spinner';
import { useAlert } from '../../components/Alert';
import { useStore } from '../../store';
import useApi from '../../hooks/useApi';
import api from '../../api/client';

const OfficerProfile = () => {
  const { alert } = useAlert();
  const { agentId, userFullName, userMobile, agentSector, updateProfile } = useStore();
  const { data: details, loading } = useApi(async () => {
    const r = await api.get(`/agent/getAgentDetails/${agentId}`);
    return r.data.agent || null;
  }, [agentId]);

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
      await api.put('/agent/updateAgentProfile', { aadhar_number: details.aadhar_number, full_name: fullName, mobile });
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
          {details?.email} · {agentSector} department
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

export default OfficerProfile;
