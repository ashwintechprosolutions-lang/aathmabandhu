// GET /supervisor/getAllSupervisors, POST /supervisor/createSupervisor,
// DELETE /supervisor/deleteSupervisor/:id. Supervisors can reassign a complaint
// to a different officer but never resolve one, and they never hold complaints
// themselves - so deleting one needs no redistribution (unlike deleting an agent).
import React, { useState } from 'react';
import { IoAdd, IoPeopleCircle, IoTrashOutline } from 'react-icons/io5';
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

const ALL_DEPARTMENTS = 'All Departments';
const emptyForm = { full_name: '', email: '', mobile: '', aadhar_number: '', monitors_sector: '', password: '', Cpassword: '' };

const SupervisorTile = ({ supervisor: s, busy, onRemove }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="touchable tile-card" onClick={() => setOpen(true)}>
        <div>
          <div className="complaint-id">{s.full_name}</div>
          <div className="complaint-sector">{s.monitors_sector || ALL_DEPARTMENTS}</div>
        </div>
        <div className="tile-notes">Can reassign complaints, cannot resolve them</div>
        <div className="tile-footer">
          <span className="status-badge" style={{ color: COLORS.navy, borderColor: COLORS.navy }}>Supervisor</span>
        </div>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={s.full_name}>
        <div>
          <div className="field-label">Monitors</div>
          <div className="field-value">{s.monitors_sector || ALL_DEPARTMENTS}</div>
        </div>
        <div>
          <div className="field-label">Contact</div>
          <div className="field-value">{s.email}<br />{s.mobile}</div>
        </div>
        <div className="complaint-actions">
          <button type="button" className="pill-btn outline" disabled={busy} onClick={() => onRemove(s)}>
            <IoTrashOutline size={13} style={{ verticalAlign: -2 }} /> {busy ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </Modal>
    </>
  );
};

const AdminSupervisors = () => {
  const { alert } = useAlert();
  const { data: supervisors, loading, reload } = useApi(async () => (await api.get('/supervisor/getAllSupervisors')).data.supervisors || [], []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busyId, setBusyId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: v }));

  async function createSupervisor() {
    const { full_name, email, mobile, aadhar_number, password, Cpassword } = form;
    if (!full_name || !email || !mobile || !aadhar_number || !password) {
      alert(' ', 'Please fill in every field.');
      return;
    }
    if (password !== Cpassword) {
      alert(' ', 'Password not match.');
      return;
    }
    setSubmitting(true);
    try {
      const monitors_sector = form.monitors_sector === ALL_DEPARTMENTS ? '' : form.monitors_sector;
      await api.post('/supervisor/createSupervisor', { ...form, monitors_sector, user_type_id: 4 });
      alert(' ', 'Supervisor created successfully.');
      setForm(emptyForm);
      setShowForm(false);
      reload();
    } catch (error) {
      console.log(error);
      alert(' ', error.response?.data?.message || 'Could not create the supervisor.');
    } finally {
      setSubmitting(false);
    }
  }

  async function removeSupervisor(supervisor) {
    if (!window.confirm(`Remove ${supervisor.full_name}?`)) return;
    setBusyId(supervisor.supervisor_id);
    try {
      await api.delete(`/supervisor/deleteSupervisor/${supervisor.supervisor_id}`);
      alert(' ', 'Supervisor removed.');
      reload();
    } catch (error) {
      console.log(error);
      alert(' ', 'Could not remove this supervisor.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="page-title-row">
        <span className="page-title">Supervisors</span>
        <button type="button" className="touchable pill-btn" style={{ background: COLORS.navy, marginLeft: 'auto' }} onClick={() => setShowForm((s) => !s)}>
          <IoAdd size={14} style={{ verticalAlign: -2 }} /> {showForm ? 'Cancel' : 'Add Supervisor'}
        </button>
      </div>
      <div className="page-subtitle">Supervisors can view complaints and agents, and reassign a complaint to a different officer - but never resolve a complaint or create new accounts.</div>

      {showForm && (
        <div className="panel" style={{ margin: '4px 20px 16px', padding: 18 }}>
          <div className="column" style={{ gap: 10 }}>
            <Field value={form.full_name} onChangeText={set('full_name')} placeholder="Full name" style={{ width: '100%' }} />
            <Field value={form.email} onChangeText={set('email')} placeholder="Email" keyboardType="email-address" style={{ width: '100%' }} />
            <Field value={form.mobile} onChangeText={set('mobile')} placeholder="Mobile number" keyboardType="numeric" style={{ width: '100%' }} />
            <Field value={form.aadhar_number} onChangeText={set('aadhar_number')} placeholder="Aadhaar number" style={{ width: '100%' }} />
            <Select
              value={form.monitors_sector}
              onChange={set('monitors_sector')}
              options={[ALL_DEPARTMENTS, ...SECTORS]}
              placeholder="Monitors (department, or all)"
              style={{ width: '100%' }}
            />
            <Field value={form.password} onChangeText={set('password')} placeholder="Password" secureTextEntry style={{ width: '100%' }} />
            <Field value={form.Cpassword} onChangeText={set('Cpassword')} placeholder="Confirm password" secureTextEntry style={{ width: '100%' }} />
            <LoginButton btnLabel={submitting ? 'Creating…' : 'Create Supervisor'} Press={createSupervisor} />
          </div>
        </div>
      )}

      <div className="dash-section" style={{ paddingBottom: 24 }}>
        {loading && <Spinner label="Loading supervisors…" />}
        {!loading && !supervisors?.length && <EmptyState Icon={IoPeopleCircle} title="No supervisors yet" />}
        {!loading && !!supervisors?.length && (
          <div className="tile-grid">
            {supervisors.map((s) => (
              <SupervisorTile key={s.supervisor_id} supervisor={s} busy={busyId === s.supervisor_id} onRemove={removeSupervisor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupervisors;
