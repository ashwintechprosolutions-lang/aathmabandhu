// GET /user/getAllUsers - read-only (the backend has no admin endpoint to edit or
// remove a citizen account, so none is offered here).
import React from 'react';
import { IoPeopleCircle } from 'react-icons/io5';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import { COLORS } from '../../constants';
import useApi from '../../hooks/useApi';
import api from '../../api/client';

const AdminCitizens = () => {
  const { data: citizens, loading } = useApi(async () => (await api.get('/user/getAllUsers')).data.users || [], []);

  return (
    <div>
      <div className="page-title-row">
        <span className="page-title">Citizens</span>
      </div>
      <div className="page-subtitle">{citizens?.length ?? 0} registered</div>

      <div className="dash-section" style={{ paddingBottom: 24 }}>
        {loading && <Spinner label="Loading citizens…" />}
        {!loading && !citizens?.length && <EmptyState Icon={IoPeopleCircle} title="No citizens registered yet" />}
        {!loading && !!citizens?.length && (
          <div className="panel">
            {citizens.map((u, i) => (
              <div key={u.user_id} className="notif-row" style={{ borderTop: i === 0 ? 'none' : undefined }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="notif-message" style={{ fontWeight: 700 }}>{u.full_name}</div>
                  <div className="notif-time" style={{ marginTop: 3 }}>{u.email} · {u.mobile}</div>
                </div>
                <span className="status-badge" style={{ color: COLORS.navy, borderColor: COLORS.navy, flexShrink: 0 }}>
                  Aadhaar ···{String(u.aadhar_number).slice(-4)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCitizens;
