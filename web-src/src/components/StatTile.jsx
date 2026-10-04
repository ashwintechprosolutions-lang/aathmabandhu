import React from 'react';

const StatTile = ({ label, value, Icon, color }) => (
  <div className="stat-tile">
    <div className="stat-tile-icon" style={{ color, background: `${color}1a` }}>
      <Icon size={20} />
    </div>
    <div className="stat-tile-value">{value}</div>
    <div className="stat-tile-label">{label}</div>
  </div>
);

export default StatTile;
