// Compact square glass tile used in a grid (citizen "My Complaints", the officer
// dashboard, the admin complaints list). Click opens a Modal with the full detail
// view - the tile itself only has room for the essentials. `subtitle`/`right` (an
// assignment note / role-specific action buttons) move into that modal.
import React, { useState } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import StatusBadge from './StatusBadge';
import LevelBadge from './LevelBadge';
import Modal from './Modal';
import { COLORS } from '../constants';
import { formatDate } from '../utils/format';

const ComplaintListItem = ({ complaint, subtitle, right }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="touchable tile-card" onClick={() => setOpen(true)}>
        <div>
          <div className="complaint-id">{complaint.complaint_id}</div>
          <div className="complaint-sector">{complaint.sector}</div>
        </div>
        <div className="tile-notes">{complaint.notes}</div>
        <div className="tile-footer">
          <StatusBadge status={complaint.status} />
          <LevelBadge level={complaint.case_level} />
        </div>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={complaint.complaint_id}>
        <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
          <StatusBadge status={complaint.status} />
          <LevelBadge level={complaint.case_level} />
        </div>

        <div>
          <div className="field-label">Department</div>
          <div className="field-value">{complaint.sector}</div>
        </div>

        <div>
          <div className="field-label">Description</div>
          <div className="field-value complaint-notes">{complaint.notes}</div>
        </div>

        <div>
          <div className="field-label">Location</div>
          <div className="field-value complaint-meta">
            <IoLocationOutline size={14} color={COLORS.gray} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>
              {complaint.complaint_address}
              {complaint.complaint_pincode ? ` - ${complaint.complaint_pincode}` : ''}
            </span>
          </div>
        </div>

        <div>
          <div className="field-label">Raised on</div>
          <div className="field-value">{formatDate(complaint.createdAt)}</div>
        </div>

        {subtitle && (
          <div>
            <div className="field-label">Assignment</div>
            <div className="field-value complaint-subtitle">{subtitle}</div>
          </div>
        )}

        {right}
      </Modal>
    </>
  );
};

export default ComplaintListItem;
