// Status is always shown as icon + label + color together (dataviz: never color alone).
import React from 'react';
import { IoCheckmarkCircle, IoSync, IoTime } from 'react-icons/io5';
import { STATUS_META } from '../constants/viz';

const ICONS = { time: IoTime, sync: IoSync, check: IoCheckmarkCircle };

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || { label: status, color: '#898781', icon: 'time' };
  const Icon = ICONS[meta.icon];
  return (
    <span className="status-badge" style={{ color: meta.color, borderColor: meta.color }}>
      <Icon size={13} />
      {meta.label}
    </span>
  );
};

export default StatusBadge;
