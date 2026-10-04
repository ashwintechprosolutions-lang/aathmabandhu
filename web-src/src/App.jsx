import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  Login,
  ForgotPassword,
  SignUp,
  SplashScreen,
  GetStarted,
  VerifyOTP,
  CitizenHome,
  MyComplaints,
  NewComplaint,
  CitizenNotifications,
  CitizenProfile,
  OfficerDashboard,
  OfficerNotifications,
  OfficerProfile,
  AdminDashboard,
  AdminMap,
  AdminComplaints,
  AdminOfficers,
  AdminCitizens,
  AdminNotifications,
} from './screens';
import CitizenLayout from './navigation/CitizenLayout';
import OfficerLayout from './navigation/OfficerLayout';
import AdminLayout from './navigation/AdminLayout';
import { ROUTES, USER_TYPES } from './constants';
import { useStore } from './store';

const SPLASH_MS = 3000;

const HOME_FOR = { [USER_TYPES.ADMIN]: ROUTES.ADMIN, [USER_TYPES.CITIZEN]: ROUTES.HOME, [USER_TYPES.OFFICER]: ROUTES.OFFICER };

// Guards a role's route tree: not logged in -> Get Started; logged in as the wrong
// role -> that role's own home, so a citizen can never land on /admin and back.
function RequireRole({ type, children }) {
  const { isLoggedIn, userType } = useStore();
  if (!isLoggedIn) return <Navigate to={ROUTES.GETSTARTED} replace />;
  if (Number(userType) !== type) return <Navigate to={HOME_FOR[Number(userType)] || ROUTES.GETSTARTED} replace />;
  return children;
}

export default function App() {
  const { isLoggedIn, userType } = useStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) return <SplashScreen />;

  const landing = isLoggedIn ? HOME_FOR[Number(userType)] || ROUTES.GETSTARTED : ROUTES.GETSTARTED;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={landing} replace />} />
      <Route path={ROUTES.GETSTARTED} element={<GetStarted />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<SignUp />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.VERIFY_OTP} element={<VerifyOTP />} />

      <Route
        element={
          <RequireRole type={USER_TYPES.CITIZEN}>
            <CitizenLayout />
          </RequireRole>
        }
      >
        <Route path={ROUTES.HOME} element={<CitizenHome />} />
        <Route path={ROUTES.CITIZEN_COMPLAINTS} element={<MyComplaints />} />
        <Route path={ROUTES.CITIZEN_NOTIFICATIONS} element={<CitizenNotifications />} />
        <Route path={ROUTES.CITIZEN_PROFILE} element={<CitizenProfile />} />
      </Route>
      {/* Full-page form, outside the tab/drawer shell but still guarded. */}
      <Route
        path={ROUTES.CITIZEN_NEW_COMPLAINT}
        element={
          <RequireRole type={USER_TYPES.CITIZEN}>
            <NewComplaint />
          </RequireRole>
        }
      />

      <Route
        element={
          <RequireRole type={USER_TYPES.OFFICER}>
            <OfficerLayout />
          </RequireRole>
        }
      >
        <Route path={ROUTES.OFFICER} element={<OfficerDashboard />} />
        <Route path={ROUTES.OFFICER_NOTIFICATIONS} element={<OfficerNotifications />} />
        <Route path={ROUTES.OFFICER_PROFILE} element={<OfficerProfile />} />
      </Route>

      <Route
        element={
          <RequireRole type={USER_TYPES.ADMIN}>
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN_MAP} element={<AdminMap />} />
        <Route path={ROUTES.ADMIN_COMPLAINTS} element={<AdminComplaints />} />
        <Route path={ROUTES.ADMIN_OFFICERS} element={<AdminOfficers />} />
        <Route path={ROUTES.ADMIN_CITIZENS} element={<AdminCitizens />} />
        <Route path={ROUTES.ADMIN_NOTIFICATIONS} element={<AdminNotifications />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
