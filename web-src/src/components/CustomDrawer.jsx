// Port of the @react-navigation/drawer setup in DrawerNavigator.js + CustomDrawer.js.
import React from 'react';
import { IoHomeSharp } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { COLORS, IMGS } from '../constants';
import { useStore } from '../store';

const DRAWER_WIDTH = 'min(320px, calc(100vw - 56px))';

const DrawerItem = ({ label, Icon, active, onPress }) => {
  const color = active ? '#ffffff' : 'rgba(11, 21, 43, 0.68)';
  return (
    <button
      type="button"
      className="drawer-item"
      onClick={onPress}
      style={{ background: active ? `linear-gradient(90deg, ${COLORS.navy}, ${COLORS.navyDeep})` : 'transparent', color }}
    >
      <Icon size={18} color={color} />
      <span style={{ marginLeft: 32, fontWeight: 500, fontSize: 14 }}>{label}</span>
    </button>
  );
};

const CustomDrawer = ({ open, onClose, items, subtitle }) => {
  const { userFullName } = useStore();
  return (
    <>
      <div className={`drawer-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <aside className={`drawer${open ? ' open' : ''}`} style={{ width: DRAWER_WIDTH }} aria-hidden={!open}>
        <div
          style={{
            height: 140,
            background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`,
            position: 'relative',
          }}
        >
          <img src={IMGS.PROFILE1} alt="Profile" className="drawer-user-img" />
        </div>
        <div className="drawer-identity">
          <div className="drawer-name">{userFullName}</div>
          {subtitle && <div className="drawer-subtitle">{subtitle}</div>}
        </div>
        <div style={{ marginTop: 8 }}>
        {items.map((item) => (
          <DrawerItem key={item.label} {...item} />
        ))}
      </div>
      </aside>
    </>
  );
};

export const DRAWER_ICONS = { home: IoHomeSharp, logout: MdLogout };
export default CustomDrawer;
