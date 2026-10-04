import React from 'react';
import { IoGrid, IoNotifications, IoPerson } from 'react-icons/io5';
import RoleShell from './RoleShell';
import { ROUTES } from '../constants';
import { useStore } from '../store';

const tabs = [
  { label: 'Queue', Icon: IoGrid, path: ROUTES.OFFICER },
  { label: 'Alerts', Icon: IoNotifications, path: ROUTES.OFFICER_NOTIFICATIONS },
];

const drawerItems = [
  { label: 'Dashboard', Icon: IoGrid, path: ROUTES.OFFICER },
  { label: 'Notifications', Icon: IoNotifications, path: ROUTES.OFFICER_NOTIFICATIONS },
  { label: 'Profile', Icon: IoPerson, path: ROUTES.OFFICER_PROFILE },
];

const OfficerLayout = () => {
  const { agentSector } = useStore();
  return <RoleShell roleLabel={agentSector ? `Officer · ${agentSector}` : 'Officer'} tabs={tabs} drawerItems={drawerItems} />;
};

export default OfficerLayout;
