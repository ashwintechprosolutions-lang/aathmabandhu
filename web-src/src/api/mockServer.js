// In-browser mock of GovServiceAppBackend (Express + Sequelize).
// Every route, request body and response shape mirrors the real controllers so the
// UI code is identical whether it talks to this mock or to the live API.
// Data lives in localStorage so it survives refreshes; call resetMockDb() to reseed.
import { seed, heuristicLevel } from './dummyData';

// Mirrors GovServiceAppBackend/services/agentAssignment.js. Kept local (rather than
// imported from dummyData.js) because it must rank the CURRENT db.agents state -
// including officers created live via /agent/createAgent - not the static seed list.
const LEVEL_RANK = { Junior: 1, Senior: 2, Lead: 3 };
const CASE_TO_OFFICER_LEVEL = { Low: 'Junior', Medium: 'Senior', High: 'Lead' };
function pickOfficerByLevel(agentsInSector, caseLevel) {
  const targetRank = LEVEL_RANK[CASE_TO_OFFICER_LEVEL[caseLevel]] || LEVEL_RANK.Junior;
  return [...agentsInSector].sort((a, b) => {
    const rankA = LEVEL_RANK[a.officer_level] || LEVEL_RANK.Junior;
    const rankB = LEVEL_RANK[b.officer_level] || LEVEL_RANK.Junior;
    const distA = Math.abs(rankA - targetRank) + (rankA < targetRank ? 0.5 : 0);
    const distB = Math.abs(rankB - targetRank) + (rankB < targetRank ? 0.5 : 0);
    return distA !== distB ? distA - distB : a.users_assigned.length - b.users_assigned.length;
  })[0];
}

const DB_KEY = 'atmabandhu_mock_db_v3';
const LATENCY_MS = 350;
const OTP_TTL_MS = 10 * 60 * 1000;

let memoryDb = null;

function load() {
  if (memoryDb) return memoryDb;
  try {
    const raw = localStorage.getItem(DB_KEY);
    memoryDb = raw ? JSON.parse(raw) : seed();
  } catch {
    memoryDb = seed();
  }
  return memoryDb;
}

function save(db) {
  memoryDb = db;
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* storage unavailable: keep in memory only */
  }
}

export function resetMockDb() {
  save(seed());
}

const now = () => new Date().toISOString();
const ok = (data, status = 200) => ({ status, data });
const fail = (status, data) => ({ status, data });
const lc = (s) => String(s ?? '').toLowerCase();
const nextId = (rows, key) => rows.reduce((m, r) => Math.max(m, Number(r[key]) || 0), 0) + 1;
const fakeJwt = (payload) =>
  `mock.${btoa(unescape(encodeURIComponent(JSON.stringify({ ...payload, iat: Date.now() }))))}.sig`;
const genOtp = () => String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
const genComplaintId = () => `SRV${Math.random().toString().substr(2, 4)}AB`;
const publicUser = ({ password, ...u }) => u;

// ---------- /auth ----------
function signUp(db, body) {
  const { email, password, Cpassword, full_name, aadhar_number, mobile, user_type_id } = body;
  if (password !== Cpassword) return fail(400, { message: 'Password not match.' });
  if (db.users.find((u) => u.email === lc(email))) return fail(400, { message: 'User already exists.' });

  const user = {
    user_id: nextId(db.users, 'user_id'),
    user_type_id: Number(user_type_id),
    email: lc(email),
    password,
    full_name,
    aadhar_number: String(aadhar_number),
    mobile: Number(mobile),
    userImage: null,
    otp: null,
    otpExpiration: null,
    createdAt: now(),
    updatedAt: now(),
  };
  user.notification_id = user.user_type_id === 1 ? 'Admin1' : `User${user.user_id}`;
  db.users.push(user);
  save(db);
  return ok({ message: 'User created successfully.' });
}

function login(db, body) {
  const email = lc(body.email);
  const user = db.users.find((u) => u.email === email);
  const agent = db.agents.find((a) => a.email === email);

  if (user) {
    if (user.password !== body.password) return fail(400, { message: 'Password is incorrect.' });
    const token = fakeJwt({ user_id: user.user_id, user_type_id: user.user_type_id });
    db.sessions.push({ session_id: nextId(db.sessions, 'session_id'), userId: String(user.user_id), jwt: token, status: 'Valid', createdAt: now(), updatedAt: now() });
    save(db);
    return ok({
      token,
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: user.full_name,
        mobile: user.mobile,
        is_profile: user.is_profile,
        user_type_id: user.user_type_id,
        user_id: user.user_id,
        notification_id: user.notification_id,
      },
      message: 'User Successfully Loggedin.',
    });
  }
  if (agent) {
    if (agent.password !== body.password) return fail(400, { message: 'Password is incorrect.' });
    const token = fakeJwt({ agent_id: agent.agent_id, user_type_id: agent.user_type_id });
    db.sessions.push({ session_id: nextId(db.sessions, 'session_id'), userId: String(agent.agent_id), jwt: token, status: 'Valid', createdAt: now(), updatedAt: now() });
    save(db);
    return ok({
      token,
      data: {
        full_name: agent.full_name,
        mobile: agent.mobile,
        user_type_id: agent.user_type_id,
        agent_id: agent.agent_id,
        agent_sector: agent.agent_sector,
      },
      message: 'Agent Successfully Loggedin.',
    });
  }
  return fail(400, { message: 'User not exist.' });
}

function forgotPassword(db, body) {
  const email = lc(body.email);
  const account = db.users.find((u) => u.email === email) || db.agents.find((a) => a.email === email);
  if (!account) return fail(400, { message: 'User not exist.' });

  const otp = genOtp();
  account.otp = otp;
  account.otpExpiration = new Date(Date.now() + OTP_TTL_MS).toISOString();
  save(db);
  // No email server in mock mode: surface the OTP so the flow can be tested.
  console.info(`[mock] Password reset OTP for ${email}: ${otp}`);
  return ok({ message: `Password reset OTP sent to your email. (Demo OTP: ${otp})` });
}

function verifyEmailOTP(db, body) {
  const { email, otp, password, Cpassword } = body;
  const account = db.users.find((u) => u.email === lc(email)) || db.agents.find((a) => a.email === lc(email));
  if (!account) return fail(400, { message: 'User not exist.' });
  if (account.otp !== String(otp) || new Date(account.otpExpiration) < new Date()) {
    return fail(400, { message: 'Invalid OTP or OTP has expired.' });
  }
  if (password !== Cpassword) return fail(400, { message: 'Password not match.' });
  account.password = password;
  account.otp = null;
  account.otpExpiration = null;
  save(db);
  return ok({ message: 'OTP is valid.' });
}

// ---------- /user ----------
const getAllUsers = (db) => ok({ users: db.users.filter((u) => u.user_type_id === 2).map(publicUser) });
const getUserDetails = (db, _b, [id]) => ok({ user: db.users.filter((u) => String(u.user_id) === id).map(publicUser) });
const getUserComplaints = (db, _b, [id]) => ok({ complaints: db.complaints.filter((c) => String(c.user_id) === id) });
const getComplaintDetails = (db, _b, [id]) => ok({ complaint: db.complaints.find((c) => c.complaint_id === id) || null });

function updateUserProfile(db, body) {
  const rows = db.users.filter((u) => u.aadhar_number === String(body.aadhar_number));
  rows.forEach((u) => Object.assign(u, { full_name: body.full_name, mobile: Number(body.mobile), updatedAt: now() }));
  save(db);
  return ok({ user: [rows.length] });
}

// ---------- /complaint ----------
function registerComplaint(db, body) {
  const sectorAgents = db.agents.filter((a) => a.agent_sector === body.sector);
  if (sectorAgents.length === 0) return fail(400, { message: 'No agents available for this sector.' });

  // Same routing as the live backend: classify urgency, then pick the officer
  // whose rank best matches it (closest rank first, least-loaded as tie-break).
  const case_level = heuristicLevel(body.notes);
  const agent = pickOfficerByLevel(sectorAgents, case_level);
  const complaint = {
    complaint_id: genComplaintId(),
    pdfComplaint: body.pdfComplaint instanceof File ? `uploads/${body.pdfComplaint.name}` : '',
    user_id: Number(body.user_id),
    sector: body.sector,
    complaint_address: body.complaint_address,
    complaint_pincode: Number(body.complaint_pincode),
    notes: body.notes,
    case_level,
    agent_id: agent.agent_id,
    status: sectorAgents.length === 1 ? body.status : 'pending',
    createdAt: now(),
    updatedAt: now(),
  };
  db.complaints.push(complaint);
  agent.users_assigned.push(complaint);
  save(db);
  return ok({ agentAssigned: agent.agent_id, case_level });
}

const getAllComplaints = (db) => ok({ complaints: db.complaints });

// ---------- /agent ----------
function createAgent(db, body) {
  const { email, password, Cpassword, full_name, mobile, user_type_id, agent_sector, aadhar_number, officer_level } = body;
  if (password !== Cpassword) return fail(400, { message: 'Password not match.' });
  if (db.agents.find((a) => a.email === lc(email))) return fail(400, { message: 'User already exists.' });
  if (db.agents.find((a) => a.aadhar_number === lc(aadhar_number))) {
    return fail(400, { message: 'An agent with this aadhar number already exists.' });
  }
  const agent = {
    agent_id: nextId(db.agents, 'agent_id'),
    user_type_id: Number(user_type_id),
    email: lc(email),
    full_name,
    mobile: Number(mobile),
    password,
    users_assigned: [],
    agent_sector,
    officer_level: ['Junior', 'Senior', 'Lead'].includes(officer_level) ? officer_level : 'Junior',
    otp: null,
    otpExpiration: null,
    aadhar_number: String(aadhar_number),
    createdAt: now(),
    updatedAt: now(),
  };
  agent.notification_id = `Agent${agent.agent_id}`;
  db.agents.push(agent);
  save(db);
  return ok({ message: 'Agent created successfully.' });
}

const getAllAgents = (db) => ok({ agents: db.agents.map(publicUser) });
const getAgent = (db, _b, [id]) => {
  const a = db.agents.find((x) => String(x.agent_id) === id);
  return ok({ agent: a ? publicUser(a) : null });
};

function changeStatus(db, body) {
  const { complaint_id, agent_id, status } = body;
  const complaint = db.complaints.find((c) => c.complaint_id === complaint_id);
  if (!complaint) return fail(404, { error: 'Complaint not found' });

  if (status === 'completed') {
    const agent = db.agents.find((a) => a.agent_id === complaint.agent_id);
    if (agent) agent.users_assigned = agent.users_assigned.filter((c) => c.complaint_id !== complaint_id);
    db.complaints = db.complaints.filter((c) => c.complaint_id !== complaint_id);
    save(db);
    return ok('Notification Deleted');
  }

  const agent = db.agents.find((a) => a.agent_id === Number(agent_id));
  if (!agent) return fail(404, { error: 'Agent not found' });
  Object.assign(complaint, { status, agent_id: agent.agent_id, updatedAt: now() });
  const idx = agent.users_assigned.findIndex((c) => c.complaint_id === complaint_id);
  if (idx >= 0) agent.users_assigned[idx] = { ...complaint };
  else agent.users_assigned.push({ ...complaint });
  save(db);
  return ok({ message: 'Added complaint to agent complaint list' });
}

function deleteAgent(db, _b, [id]) {
  const agent = db.agents.find((a) => String(a.agent_id) === id);
  if (!agent) return fail(404, { message: 'Agent not found' });

  if (agent.users_assigned.length === 0) {
    db.agents = db.agents.filter((a) => a !== agent);
    save(db);
    return ok({ message: 'Agent Deleted Successfully' });
  }
  const others = db.agents.filter((a) => a.agent_sector === agent.agent_sector && a !== agent);
  if (others.length === 0) {
    return fail(400, { message: 'No agents are there from this sector to take the pending complaints.' });
  }
  const ids = [];
  for (const c of agent.users_assigned) {
    const target = others.reduce((min, cur) => (cur.users_assigned.length < min.users_assigned.length ? cur : min), others[0]);
    target.users_assigned.push(c);
    const row = db.complaints.find((x) => x.complaint_id === c.complaint_id);
    if (row) row.agent_id = target.agent_id;
    ids.push(target.agent_id);
  }
  db.agents = db.agents.filter((a) => a !== agent);
  save(db);
  return ok({ id: ids, message: `Agent ${id} deleted and complaints redistributed.` });
}

function updateAgentProfile(db, body) {
  const rows = db.agents.filter((a) => a.aadhar_number === String(body.aadhar_number));
  rows.forEach((a) => Object.assign(a, { full_name: body.full_name, mobile: Number(body.mobile), updatedAt: now() }));
  save(db);
  return ok({ agent: [rows.length] });
}

// ---------- /notification ----------
function sendNotifications(db, body) {
  const { notification_id, message, date, time } = body;
  db.notifications.push({ id: nextId(db.notifications, 'id'), notification_id, message, date, time, meet: null, createdAt: now(), updatedAt: now() });
  save(db);
  return ok({ message: 'Notification Sent Succesfully.' });
}
const getNotifications = (db, _b, [id]) => ok({ data: db.notifications.filter((n) => n.notification_id === id) });
function deleteNotification(db, _b, [id]) {
  db.notifications = db.notifications.filter((n) => String(n.id) !== id);
  save(db);
  return ok('Notification Deleted');
}

// ---------- router ----------
const routes = [
  ['get', /^\/$/, () => ok({ message: 'hello from api' })],

  ['post', /^\/auth\/signUp$/, signUp],
  ['post', /^\/auth\/login$/, login],
  ['post', /^\/auth\/ForgotPassword$/, forgotPassword],
  ['post', /^\/auth\/verifyEmailOTP$/, verifyEmailOTP],

  ['get', /^\/user\/getAllComplaints\/([^/]+)$/, getUserComplaints],
  ['get', /^\/user\/getComplaintDetails\/([^/]+)$/, getComplaintDetails],
  ['get', /^\/user\/getAllUsers$/, getAllUsers],
  ['get', /^\/user\/getUserDetails\/([^/]+)$/, getUserDetails],
  ['put', /^\/user\/updateUserProfile$/, updateUserProfile],

  ['post', /^\/complaint\/registerComplaint$/, registerComplaint],
  ['get', /^\/complaint\/getAllComplaints$/, getAllComplaints],

  ['post', /^\/agent\/createAgent$/, createAgent],
  ['get', /^\/agent\/getAllAgents$/, getAllAgents],
  ['get', /^\/agent\/getAgentDetails\/([^/]+)$/, getAgent],
  ['get', /^\/agent\/getAgentComplaints\/([^/]+)$/, getAgent],
  ['post', /^\/agent\/changeStatus$/, changeStatus],
  ['delete', /^\/agent\/deleteAgent\/([^/]+)$/, deleteAgent],
  ['put', /^\/agent\/updateAgentProfile$/, updateAgentProfile],

  ['post', /^\/notification\/sendNotifications$/, sendNotifications],
  ['get', /^\/notification\/getNotifications\/([^/]+)$/, getNotifications],
  ['delete', /^\/notification\/deleteNotification\/([^/]+)$/, deleteNotification],
];

function parseBody(data) {
  if (!data) return {};
  if (typeof FormData !== 'undefined' && data instanceof FormData) return Object.fromEntries(data.entries());
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data;
}

export async function handle(method, url, data) {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  const path = new URL(url, 'http://mock').pathname;
  for (const [m, re, fn] of routes) {
    if (m !== method) continue;
    const match = path.match(re);
    if (match) {
      const params = match.slice(1).map(decodeURIComponent);
      return fn(load(), parseBody(data), params);
    }
  }
  return fail(404, `Cannot ${method.toUpperCase()} ${path}`);
}
