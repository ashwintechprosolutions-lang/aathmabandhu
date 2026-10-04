// GET /agent/getAllAgents, POST /agent/createAgent, DELETE /agent/deleteAgent/:id
// (GovServiceAppBackend/controllers/agentController.js). Deleting an officer with
// open complaints redistributes them to other officers in the same department -
// the backend does this automatically; the returned message is shown verbatim.
import React, { useState } from 'react';
import { IoAdd, IoPeople, IoTrashOutline } from 'react-icons/io5';
import Field from '../../components/Field';
import Select from '../../components/Select';
import LoginButton from '../../components/LoginButton';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import { useAlert } from '../../components/Alert';
import { COLORS, SECTORS } from '../../constants';
import useApi from '../../hooks/useApi';
import api from '../../api/client';

const emptyForm = { full_name: '', email: '', mobile: '', aadhar_number: '', agent_sector: '', officer_level: '', password: '', Cpassword: '' };
const OFFICER_LEVELS = ['Junior', 'Senior', 'Lead'];

// Compact square tile, same pattern as ComplaintListItem - click for full detail + Remove.
const OfficerTile = ({ agent: a, busy, onRemove }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="touchable tile-card" onClick={() => setOpen(true)}>
        <div>
          <div className="complaint-id">{a.full_name}</div>
          <div className="complaint-sector">{a.agent_sector}</div>
        </div>
        <div className="tile-notes">{a.officer_level || 'Junior'} officer</div>
        <div className="tile-footer">
          <span className="status-badge" style={{ color: COLORS.navy, borderColor: COLORS.navy }}>
            {a.users_assigned?.length || 0} assigned
          </span>
        </div>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={a.full_name}>
        <div>
          <div className="field-label">Department</div>
          <div className="field-value">{a.agent_sector}</div>
        </div>
        <div>
          <div className="field-label">Officer level</div>
          <div className="field-value">{a.officer_level || 'Junior'}</div>
        </div>
        <div>
          <div className="field-label">Contact</div>
          <div className="field-value">{a.email}<br />{a.mobile}</div>
        </div>
        <div>
          <div className="field-label">Open complaints assigned</div>
          <div className="field-value">{a.users_assigned?.length || 0}</div>
        </div>
        <div className="complaint-actions">
          <button type="button" className="pill-btn outline" disabled={busy} onClick={() => onRemove(a)}>
            <IoTrashOutline size={13} style={{ verticalAlign: -2 }} /> {busy ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </Modal>
    </>
  );
};

const AdminOfficers = () => {
  const { alert } = useAlert();
  const { data: agents, loading, reload } = useApi(async () => (await api.get('/agent/getAllAgents')).data.agents || [], []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busyId, setBusyId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: v }));

  async function createOfficer() {
    const { full_name, email, mobile, aadhar_number, agent_sector, officer_level, password, Cpassword } = form;
    if (!full_name || !email || !mobile || !aadhar_number || !agent_sector || !officer_level || !password) {
      alert(' ', 'Please fill in every field.');
      return;
    }
    if (password !== Cpassword) {
      alert(' ', 'Password not match.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/agent/createAgent', { ...form, user_type_id: 3 });
      alert(' ', 'Officer created successfully.');
      setForm(emptyForm);
      setShowForm(false);
      reload();
    } catch (error) {
      console.log(error);
      alert(' ', error.response?.data?.message || 'Could not create the officer.');
    } finally {
      setSubmitting(false);
    }
  }

  async function removeOfficer(agent) {
    if (!window.confirm(`Remove ${agent.full_name}? Their open complaints will be redistributed to other ${agent.agent_sector} officers.`)) return;
    setBusyId(agent.agent_id);
    try {
      const r = await api.delete(`/agent/deleteAgent/${agent.agent_id}`);
      alert(' ', r.data.message);
      reload();
    } catch (error) {
      console.log(error);
      alert(' ', error.response?.data?.message || 'Could not remove this officer.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="page-title-row">
        <span className="page-title">Officers</span>
        <button type="button" className="touchable pill-btn" style={{ background: COLORS.navy, marginLeft: 'auto' }} onClick={() => setShowForm((s) => !s)}>
          <IoAdd size={14} style={{ verticalAlign: -2 }} /> {showForm ? 'Cancel' : 'Add Officer'}
        </button>
      </div>

      {showForm && (
        <div className="panel" style={{ margin: '4px 20px 16px', padding: 18 }}>
          <div className="column" style={{ gap: 10 }}>
            <Field value={form.full_name} onChangeText={set('full_name')} placeholder="Full name" style={{ width: '100%' }} />
            <Field value={form.email} onChangeText={set('email')} placeholder="Email" keyboardType="email-address" style={{ width: '100%' }} />
            <Field value={form.mobile} onChangeText={set('mobile')} placeholder="Mobile number" keyboardType="numeric" style={{ width: '100%' }} />
            <Field value={form.aadhar_number} onChangeText={set('aadhar_number')} placeholder="Aadhaar number" style={{ width: '100%' }} />
            <Select value={form.agent_sector} onChange={set('agent_sector')} options={SECTORS} placeholder="Department" style={{ width: '100%' }} />
            <Select
              value={form.officer_level}
              onChange={set('officer_level')}
              options={OFFICER_LEVELS}
              placeholder="Officer level (handles case urgency)"
              style={{ width: '100%' }}
            />
            <Field value={form.password} onChangeText={set('password')} placeholder="Password" secureTextEntry style={{ width: '100%' }} />
            <Field value={form.Cpassword} onChangeText={set('Cpassword')} placeholder="Confirm password" secureTextEntry style={{ width: '100%' }} />
            <LoginButton btnLabel={submitting ? 'Creating…' : 'Create Officer'} Press={createOfficer} />
          </div>
        </div>
      )}

      <div className="dash-section" style={{ paddingBottom: 24 }}>
        {loading && <Spinner label="Loading officers…" />}
        {!loading && !agents?.length && <EmptyState Icon={IoPeople} title="No officers yet" />}
        {!loading && !!agents?.length && (
          <div className="tile-grid">
            {agents.map((a) => (
              <OfficerTile key={a.agent_id} agent={a} busy={busyId === a.agent_id} onRemove={removeOfficer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOfficers;
