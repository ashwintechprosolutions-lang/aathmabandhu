// Shared complaint row used by citizen "My Complaints", the officer dashboard and
// the admin complaints list. `right` lets each role add its own action(s).
import React from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import StatusBadge from './StatusBadge';
import LevelBadge from './LevelBadge';
import { COLORS } from '../constants';
import { formatDate } from '../utils/format';

const ComplaintListItem = ({ complaint, subtitle, right }) => (
  <div className="complaint-card">
    <div className="complaint-card-top">
      <div>
        <div className="complaint-id">{complaint.complaint_id}</div>
        <div className="complaint-sector">{complaint.sector}</div>
      </div>
      <div className="column" style={{ alignItems: 'flex-end', gap: 4 }}>
        <StatusBadge status={complaint.status} />
        <LevelBadge level={complaint.case_level} />
      </div>
    </div>
    <div className="complaint-notes">{complaint.notes}</div>
    <div className="complaint-meta">
      <IoLocationOutline size={14} color={COLORS.gray} />
      <span>
        {complaint.complaint_address}
        {complaint.complaint_pincode ? ` - ${complaint.complaint_pincode}` : ''}
      </span>
    </div>
    <div className="complaint-footer">
      <span className="complaint-date">{formatDate(complaint.createdAt)}</span>
      {subtitle && <span className="complaint-subtitle">{subtitle}</span>}
    </div>
    {right}
  </div>
);

export default ComplaintListItem;
