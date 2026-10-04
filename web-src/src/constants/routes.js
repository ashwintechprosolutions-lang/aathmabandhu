// Same route keys as the mobile app (GovServiceApp/src/constants/routes.js),
// mapped to URL paths for react-router, plus the three role dashboards.
export default {
  SPLASHSCREEN: '/splash',
  GETSTARTED: '/get-started',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_OTP: '/verify-otp',

  HOME: '/home',
  HOME_TAB: '/home',
  HOME_DRAWER: '/home',
  HOME_NAVIGATOR: '/home',

  LOGOUT: '/get-started',
  SIGNUP: '/signup',

  // Citizen (user_type_id 2)
  CITIZEN_COMPLAINTS: '/home/complaints',
  CITIZEN_NEW_COMPLAINT: '/home/new-complaint',
  CITIZEN_NOTIFICATIONS: '/home/notifications',
  CITIZEN_PROFILE: '/home/profile',

  // Officer / agent (user_type_id 3) - resolves complaints
  OFFICER: '/officer',
  OFFICER_NOTIFICATIONS: '/officer/notifications',
  OFFICER_PROFILE: '/officer/profile',

  // Supervisor (user_type_id 4) - read-only monitor, never resolves
  SUPERVISOR: '/supervisor',
  SUPERVISOR_COMPLAINTS: '/supervisor/complaints',
  SUPERVISOR_AGENTS: '/supervisor/agents',
  SUPERVISOR_NOTIFICATIONS: '/supervisor/notifications',
  SUPERVISOR_PROFILE: '/supervisor/profile',

  // Admin (user_type_id 1)
  ADMIN: '/admin',
  ADMIN_MAP: '/admin/map',
  ADMIN_COMPLAINTS: '/admin/complaints',
  ADMIN_OFFICERS: '/admin/officers',
  ADMIN_CITIZENS: '/admin/citizens',
  ADMIN_SUPERVISORS: '/admin/supervisors',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
};
