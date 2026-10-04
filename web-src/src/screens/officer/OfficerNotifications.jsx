import React from 'react';
import NotificationsScreen from '../shared/NotificationsScreen';
import { useStore } from '../../store';

const OfficerNotifications = () => {
  const { notificationId } = useStore();
  return <NotificationsScreen notificationId={notificationId} title="Notifications" />;
};

export default OfficerNotifications;
