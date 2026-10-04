// Case urgency (Low/Medium/High), set by Claude's triage at registration - see
// LEVEL_META. Same icon+label+color pattern as StatusBadge (never color alone).
// Renders nothing for older complaints that predate this feature (no case_level).
import React from 'react';
import { IoAlertCircle, IoArrowDown, IoRemove } from 'react-icons/io5';
import { LEVEL_META } from '../constants/viz';

const ICONS = { low: IoArrowDown, medium: IoRemove, high: IoAlertCircle };

const LevelBadge = ({ level }) => {
  const meta = LEVEL_META[level];
  if (!meta) return null;
  const Icon = ICONS[meta.icon];
  return (
    <span className="status-badge" style={{ color: meta.color, borderColor: meta.color }}>
      <Icon size={13} />
      {meta.label}
    </span>
  );
};

export default LevelBadge;
