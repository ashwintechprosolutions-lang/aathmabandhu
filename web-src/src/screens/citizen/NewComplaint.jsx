// Mirrors POST /complaint/registerComplaint exactly (GovServiceAppBackend/controllers/complaintsController.js):
// the citizen picks a department and describes the problem; the backend auto-assigns
// the least-loaded officer in that department. There is no "pick an officer" step -
// the real API doesn't support one - and a sector with no officers returns the same
// "No agents available for this sector." error shown here.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCloudUploadOutline } from 'react-icons/io5';
import Field from '../../components/Field';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import LoginButton from '../../components/LoginButton';
import { useAlert } from '../../components/Alert';
import { COLORS, ROUTES, SECTORS } from '../../constants';
import { useStore } from '../../store';
import api from '../../api/client';

const label = { fontSize: 'min(18px, 5.2vw)', fontWeight: 'bold', color: COLORS.dark };
const row = { width: '100%', alignItems: 'flex-start', paddingLeft: 'calc(10% + 9px)' };

const NewComplaint = () => {
  const navigate = useNavigate();
  const { alert } = useAlert();
  const { userId } = useStore();
  const [sector, setSector] = useState('');
  const [complaint_address, setAddress] = useState('');
  const [complaint_pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!sector || !complaint_address || !complaint_pincode || !notes) {
      alert(' ', 'Please fill in the department, address, pincode and description.');
      return;
    }
    setSubmitting(true);
    try {
      // The backend route is behind multer (`complaintsController.upload`), so it
      // only reads fields from a multipart body - a plain JSON post would arrive empty.
      const form = new FormData();
      form.append('user_id', userId);
      form.append('sector', sector);
      form.append('complaint_address', complaint_address);
      form.append('complaint_pincode', complaint_pincode);
      form.append('notes', notes);
      form.append('status', 'pending');
      if (file) form.append('pdfComplaint', file);

      await api.post('/complaint/registerComplaint', form);
      alert(' ', 'Your complaint has been registered and assigned to an officer.');
      navigate(ROUTES.CITIZEN_COMPLAINTS, { replace: true });
    } catch (error) {
      console.log(error);
      alert(' ', error.response?.data?.message || 'Could not register the complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen scroll home-layout">
      <div className="page-title-row">
        <button type="button" className="touchable" aria-label="Back" onClick={() => navigate(-1)}>
          <IoArrowBack size={22} color={COLORS.dark} />
        </button>
        <span className="page-title">Raise a Complaint</span>
      </div>

      <form
        className="column form-wrap"
        style={{ alignItems: 'center', paddingBottom: 24 }}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="column" style={row}>
          <label style={label}>Department</label>
        </div>
        <div className="column" style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
          <Select value={sector} onChange={setSector} options={SECTORS} placeholder="Select a department" />
        </div>

        <div className="column" style={row}>
          <label style={label}>Address</label>
        </div>
        <div className="column" style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
          <Field value={complaint_address} onChangeText={setAddress} placeholder="House no., street, area" />
        </div>

        <div className="column" style={row}>
          <label style={label}>Pincode</label>
        </div>
        <div className="column" style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
          <Field value={complaint_pincode} onChangeText={setPincode} placeholder="6-digit pincode" keyboardType="numeric" />
        </div>

        <div className="column" style={row}>
          <label style={label}>Describe the issue</label>
        </div>
        <div className="column" style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
          <Textarea value={notes} onChangeText={setNotes} placeholder="What's the problem?" />
        </div>

        <div className="column" style={row}>
          <label style={label}>Attach a photo/PDF (optional)</label>
        </div>
        <div className="column" style={{ width: '100%', marginBottom: 30, alignItems: 'center' }}>
          <label className="file-picker">
            <IoCloudUploadOutline size={18} />
            <span>{file ? file.name : 'Choose a file'}</span>
            <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} hidden />
          </label>
        </div>

        <LoginButton btnLabel={submitting ? 'Submitting…' : 'Submit Complaint'} Press={submit} />
        <button type="submit" hidden aria-hidden="true" />
      </form>
    </div>
  );
};

export default NewComplaint;
