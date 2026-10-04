import React from 'react';
import NotificationsScreen from '../shared/NotificationsScreen';
import { useStore } from '../../store';

const CitizenNotifications = () => {
  const { notificationId } = useStore();
  return <NotificationsScreen notificationId={notificationId} title="Notifications" />;
};

export default CitizenNotifications;
