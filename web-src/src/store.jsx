// Replaces the pullstate stores in GovServiceApp/store.js.
// Login data is also persisted to localStorage (the mobile app wrote it to
// AsyncStorage under the same keys) so a browser refresh keeps the session.
import React, { createContext, useCallback, useContext, useState } from 'react';

const StoreContext = createContext(null);

const read = (key) => {
  try {
    const v = localStorage.getItem(key);
    return v === null ? '' : JSON.parse(v);
  } catch {
    return '';
  }
};
const write = (key, value) => {
  try {
    if (value === undefined || value === null || value === '') localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};

const SESSION_KEYS = ['authToken', 'UserId', 'UserFullName', 'UserMobile', 'NotificationId', 'UserType', 'AgentId', 'AgentSector'];

export function StoreProvider({ children }) {
  const [userToken, setUserToken] = useState(() => read('authToken'));
  const [userId, setUserId] = useState(() => read('UserId'));
  const [userFullName, setUserFullName] = useState(() => read('UserFullName'));
  const [userMobile, setUserMobile] = useState(() => read('UserMobile'));
  const [notificationId, setNotificationId] = useState(() => read('NotificationId'));
  const [userType, setUserType] = useState(() => read('UserType'));
  const [agentId, setAgentId] = useState(() => read('AgentId'));
  const [agentSector, setAgentSector] = useState(() => read('AgentSector'));
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!read('authToken'));
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // `data` is the login response's `data` object (users and agents return different fields).
  const login = useCallback((token, data) => {
    const nid = data.notification_id || (data.agent_id ? `Agent${data.agent_id}` : '');
    const session = {
      authToken: token,
      UserId: data.user_id ?? '',
      UserFullName: data.full_name,
      UserMobile: data.mobile,
      NotificationId: nid,
      UserType: data.user_type_id,
      AgentId: data.agent_id ?? '',
      AgentSector: data.agent_sector ?? '',
    };
    Object.entries(session).forEach(([k, v]) => write(k, v));
    setUserToken(token);
    setUserId(session.UserId);
    setUserFullName(data.full_name);
    setUserMobile(data.mobile);
    setNotificationId(nid);
    setUserType(data.user_type_id);
    setAgentId(session.AgentId);
    setAgentSector(session.AgentSector);
    setIsLoggedIn(true);
  }, []);

  const updateProfile = useCallback((full_name, mobile) => {
    write('UserFullName', full_name);
    write('UserMobile', mobile);
    setUserFullName(full_name);
    setUserMobile(mobile);
  }, []);

  const logout = useCallback(() => {
    SESSION_KEYS.forEach((k) => write(k, ''));
    setUserToken('');
    setUserType('');
    setIsLoggedIn(false);
  }, []);

  const value = {
    isLoggedIn,
    userToken,
    userId,
    userFullName,
    userMobile,
    notificationId,
    userType,
    agentId,
    agentSector,
    forgotPasswordEmail,
    setForgotPasswordEmail,
    login,
    updateProfile,
    logout,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
