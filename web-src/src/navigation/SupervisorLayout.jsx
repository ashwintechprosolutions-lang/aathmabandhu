import React from 'react';
import { IoDocumentText, IoGrid, IoNotifications, IoPeople, IoPerson } from 'react-icons/io5';
import RoleShell from './RoleShell';
import { ROUTES } from '../constants';
import { useStore } from '../store';

const tabs = [
  { label: 'Overview', Icon: IoGrid, path: ROUTES.SUPERVISOR },
  { label: 'Complaints', Icon: IoDocumentText, path: ROUTES.SUPERVISOR_COMPLAINTS },
  { label: 'Agents', Icon: IoPeople, path: ROUTES.SUPERVISOR_AGENTS },
  { label: 'Alerts', Icon: IoNotifications, path: ROUTES.SUPERVISOR_NOTIFICATIONS },
];

const drawerItems = [
  { label: 'Overview', Icon: IoGrid, path: ROUTES.SUPERVISOR },
  { label: 'Complaints', Icon: IoDocumentText, path: ROUTES.SUPERVISOR_COMPLAINTS },
  { label: 'Agents', Icon: IoPeople, path: ROUTES.SUPERVISOR_AGENTS },
  { label: 'Notifications', Icon: IoNotifications, path: ROUTES.SUPERVISOR_NOTIFICATIONS },
  { label: 'Profile', Icon: IoPerson, path: ROUTES.SUPERVISOR_PROFILE },
];

const SupervisorLayout = () => {
  const { monitorsSector } = useStore();
  return <RoleShell roleLabel={monitorsSector ? `Supervisor · ${monitorsSector}` : 'Supervisor · All Departments'} tabs={tabs} drawerItems={drawerItems} />;
};

export default SupervisorLayout;
