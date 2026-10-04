// Generalized version of the mobile app's DrawerNavigator + BottomTabNavigator +
// HomeNavigator: same dark header (logo left, menu right), same slide-in drawer
// with the round avatar, same dark bottom tab bar - just parameterized per role
// (citizen / officer / admin) instead of the single Home tab the mobile app has.
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import CustomDrawer from '../components/CustomDrawer';
import Logo from '../components/Logo';
import { COLORS, ROUTES } from '../constants';
import { useStore } from '../store';

const RoleShell = ({ roleLabel, tabs, drawerItems }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userFullName } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  const fullDrawerItems = [
    ...drawerItems.map((item) => ({ ...item, active: isActive(item.path), onPress: () => { setDrawerOpen(false); navigate(item.path); } })),
    {
      label: 'Logout',
      Icon: MdLogout,
      active: false,
      onPress: () => {
        setDrawerOpen(false);
        navigate(ROUTES.LOGOUT, { replace: true });
      },
    },
  ];

  return (
    <div className="home-layout">
      <header className="app-header">
        <Logo color="#ffffff" width={128} style={{ marginLeft: 15 }} />
        <div style={{ flex: 1, minWidth: 8 }} />
        {roleLabel && (
          <span className="role-pill" title={userFullName}>
            {roleLabel}
          </span>
        )}
        <button
          type="button"
          className="touchable"
          aria-label="Open menu"
          onClick={() => setDrawerOpen((o) => !o)}
          style={{ paddingRight: 20, paddingLeft: 12, display: 'flex' }}
        >
          <IoMenu size={26} color="#fff" />
        </button>
      </header>

      <main className="home-content">
        <Outlet />
      </main>

      <nav className="tab-bar">
        {tabs.map(({ label, Icon, path }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              type="button"
              className="touchable tab-button"
              aria-label={label}
              onClick={() => navigate(path)}
            >
              <Icon size={23} color={active ? '#ffffff' : 'rgba(255,255,255,0.55)'} />
              <span className="tab-label" style={{ color: active ? '#ffffff' : 'rgba(255,255,255,0.55)' }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      <CustomDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} items={fullDrawerItems} subtitle={roleLabel} />
    </div>
  );
};

export default RoleShell;
