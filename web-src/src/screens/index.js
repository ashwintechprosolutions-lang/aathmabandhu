// Auth Screens
export { default as Login } from './auth/Login';
export { default as SignUp } from './auth/SignUp';
export { default as ForgotPassword } from './auth/ForgotPassword';
export { default as SplashScreen } from './auth/SplashScreen';
export { default as GetStarted } from './auth/GetStarted';
export { default as VerifyOTP } from './auth/VerifyOTP';

// Citizen (user_type_id 2)
export { default as CitizenHome } from './citizen/CitizenHome';
export { default as MyComplaints } from './citizen/MyComplaints';
export { default as NewComplaint } from './citizen/NewComplaint';
export { default as CitizenNotifications } from './citizen/CitizenNotifications';
export { default as CitizenProfile } from './citizen/CitizenProfile';

// Officer (user_type_id 3)
export { default as OfficerDashboard } from './officer/OfficerDashboard';
export { default as OfficerNotifications } from './officer/OfficerNotifications';
export { default as OfficerProfile } from './officer/OfficerProfile';

// Supervisor (user_type_id 4) - read-only monitor role
export { default as SupervisorDashboard } from './supervisor/SupervisorDashboard';
export { default as SupervisorComplaints } from './supervisor/SupervisorComplaints';
export { default as SupervisorAgents } from './supervisor/SupervisorAgents';
export { default as SupervisorNotifications } from './supervisor/SupervisorNotifications';
export { default as SupervisorProfile } from './supervisor/SupervisorProfile';

// Admin (user_type_id 1)
export { default as AdminDashboard } from './admin/AdminDashboard';
export { default as AdminMap } from './admin/AdminMap';
export { default as AdminComplaints } from './admin/AdminComplaints';
export { default as AdminOfficers } from './admin/AdminOfficers';
export { default as AdminCitizens } from './admin/AdminCitizens';
export { default as AdminSupervisors } from './admin/AdminSupervisors';
export { default as AdminNotifications } from './admin/AdminNotifications';
