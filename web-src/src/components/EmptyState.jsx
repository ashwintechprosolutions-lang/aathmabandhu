import React from 'react';
import { COLORS } from '../constants';

const EmptyState = ({ Icon, title, subtitle }) => (
  <div className="empty-state">
    {Icon && <Icon size={40} color={COLORS.gray} />}
    <div className="empty-state-title">{title}</div>
    {subtitle && <div className="empty-state-subtitle">{subtitle}</div>}
  </div>
);

export default EmptyState;
