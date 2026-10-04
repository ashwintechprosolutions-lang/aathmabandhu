import React from 'react';
import { IoGrid, IoDocumentText, IoNotifications, IoPeople, IoPeopleCircle } from 'react-icons/io5';
import RoleShell from './RoleShell';
import { ROUTES } from '../constants';

const tabs = [
  { label: 'Overview', Icon: IoGrid, path: ROUTES.ADMIN },
  { label: 'Complaints', Icon: IoDocumentText, path: ROUTES.ADMIN_COMPLAINTS },
  { label: 'Officers', Icon: IoPeople, path: ROUTES.ADMIN_OFFICERS },
];

const drawerItems = [
  { label: 'Overview', Icon: IoGrid, path: ROUTES.ADMIN },
  { label: 'Complaints', Icon: IoDocumentText, path: ROUTES.ADMIN_COMPLAINTS },
  { label: 'Officers', Icon: IoPeople, path: ROUTES.ADMIN_OFFICERS },
  { label: 'Citizens', Icon: IoPeopleCircle, path: ROUTES.ADMIN_CITIZENS },
  { label: 'Notifications', Icon: IoNotifications, path: ROUTES.ADMIN_NOTIFICATIONS },
];

const AdminLayout = () => <RoleShell roleLabel="Administrator" tabs={tabs} drawerItems={drawerItems} />;

export default AdminLayout;
