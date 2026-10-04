import React from 'react';
import { IoDocumentText, IoHomeSharp, IoNotifications, IoPerson } from 'react-icons/io5';
import RoleShell from './RoleShell';
import { ROUTES } from '../constants';

const tabs = [
  { label: 'Home', Icon: IoHomeSharp, path: ROUTES.HOME },
  { label: 'Complaints', Icon: IoDocumentText, path: ROUTES.CITIZEN_COMPLAINTS },
  { label: 'Alerts', Icon: IoNotifications, path: ROUTES.CITIZEN_NOTIFICATIONS },
];

const drawerItems = [
  { label: 'Home', Icon: IoHomeSharp, path: ROUTES.HOME },
  { label: 'My Complaints', Icon: IoDocumentText, path: ROUTES.CITIZEN_COMPLAINTS },
  { label: 'Notifications', Icon: IoNotifications, path: ROUTES.CITIZEN_NOTIFICATIONS },
  { label: 'Profile', Icon: IoPerson, path: ROUTES.CITIZEN_PROFILE },
];

const CitizenLayout = () => <RoleShell roleLabel="Citizen" tabs={tabs} drawerItems={drawerItems} />;

export default CitizenLayout;
