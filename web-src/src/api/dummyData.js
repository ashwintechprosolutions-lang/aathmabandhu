// Seed data for the in-browser mock backend, sized for a live demo/presentation.
// Shapes match the Sequelize models in GovServiceAppBackend/models. Passwords are
// plain text because this is demo data only; the real backend hashes them with bcrypt.
//
// Everything here is fictional: e-mails use the demo domain aathmabandhu.in, and the
// 12-digit Aadhaar numbers start with 0/1, which UIDAI never issues, so they cannot
// belong to a real person.
//
// user_type_id: 1 = Admin, 2 = Citizen (only type that can log in to this app), 3 = Agent/Officer

// Deterministic PRNG so every browser gets the same demo data.
function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260924);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

const DAY = 24 * 60 * 60 * 1000;
const DEMO_NOW = Date.parse('2026-09-24T10:00:00.000Z');
const daysAgo = (d, hour = 10) => new Date(DEMO_NOW - d * DAY + (hour - 10) * 3600 * 1000).toISOString();
const dateOf = (iso) => iso.slice(0, 10);
const timeOf = (iso) => iso.slice(11, 16);

// ---------------------------------------------------------------------------
// Locations - GHMC (Greater Hyderabad Municipal Corporation) limits only. This
// app's scope is GHMC, so every seeded address/pincode stays inside the city
// boundary - no other Telangana districts/towns.
// ---------------------------------------------------------------------------
const LOCATIONS = [
  ['Ameerpet, Hyderabad', 500016],
  ['Kukatpally, Hyderabad', 500072],
  ['Secunderabad', 500003],
  ['Gachibowli, Hyderabad', 500032],
  ['Dilsukhnagar, Hyderabad', 500060],
  ['LB Nagar, Hyderabad', 500074],
  ['Miyapur, Hyderabad', 500049],
  ['Mehdipatnam, Hyderabad', 500028],
  ['Banjara Hills, Hyderabad', 500034],
  ['Jubilee Hills, Hyderabad', 500033],
  ['Malakpet, Hyderabad', 500036],
  ['Charminar, Hyderabad', 500002],
  ['Uppal, Hyderabad', 500039],
  ['Malkajgiri, Hyderabad', 500047],
  ['Attapur, Hyderabad', 500048],
  ['Musheerabad, Hyderabad', 500020],
];
const STREETS = ['Main Road', 'Temple Street', 'Gandhi Nagar', 'Nehru Colony', 'Srinivasa Colony', 'Ramalayam Street', 'Bank Colony', 'Teachers Colony', 'Market Road', 'Vidya Nagar'];
const address = (i) => {
  const [area, pin] = LOCATIONS[i % LOCATIONS.length];
  return [`${(i * 7) % 40 + 1}-${(i * 13) % 90 + 1}, ${STREETS[i % STREETS.length]}, ${area}`, pin];
};

// ---------------------------------------------------------------------------
// Admin + citizens
// ---------------------------------------------------------------------------
const baseUser = { userImage: null, otp: null, otpExpiration: null };

const admin = {
  ...baseUser,
  user_id: 1,
  user_type_id: 1,
  notification_id: 'Admin1',
  email: 'admin@aathmabandhu.in',
  password: 'Admin@123',
  full_name: 'District Administrator',
  aadhar_number: '100000000001',
  mobile: 9000000001,
  createdAt: daysAgo(120),
  updatedAt: daysAgo(120),
};

// [full name, email local part, password]. The first two keep the original demo logins.
const CITIZENS = [
  ['Ravi Kumar', 'user', 'User@123'],
  ['Priya Sharma', 'priya', 'Priya@123'],
  ['Lakshmi Devi', 'lakshmi.devi', 'Demo@123'],
  ['Venkatesh Goud', 'venkatesh.goud', 'Demo@123'],
  ['Sai Charan Reddy', 'saicharan.reddy', 'Demo@123'],
  ['Fatima Begum', 'fatima.begum', 'Demo@123'],
  ['Srinivas Rao', 'srinivas.rao', 'Demo@123'],
  ['Anjali Verma', 'anjali.verma', 'Demo@123'],
  ['Mohammed Irfan', 'mohammed.irfan', 'Demo@123'],
  ['Kavitha Naidu', 'kavitha.naidu', 'Demo@123'],
  ['Ramesh Yadav', 'ramesh.yadav', 'Demo@123'],
  ['Sunitha Reddy', 'sunitha.reddy', 'Demo@123'],
  ['Prakash Chary', 'prakash.chary', 'Demo@123'],
  ['Divya Teja', 'divya.teja', 'Demo@123'],
  ['Joseph Raju', 'joseph.raju', 'Demo@123'],
  ['Padmavathi K', 'padmavathi.k', 'Demo@123'],
  ['Nagaraju Bandi', 'nagaraju.bandi', 'Demo@123'],
  ['Swathi Rani', 'swathi.rani', 'Demo@123'],
  ['Harish Patel', 'harish.patel', 'Demo@123'],
  ['Rekha Kumari', 'rekha.kumari', 'Demo@123'],
  ['Anil Kumar Jadhav', 'anil.jadhav', 'Demo@123'],
  ['Shabana Khatoon', 'shabana.khatoon', 'Demo@123'],
  ['Mallesh Mudiraj', 'mallesh.mudiraj', 'Demo@123'],
  ['Bhavani Shankar', 'bhavani.shankar', 'Demo@123'],
  ['Geetha Lakshmi', 'geetha.lakshmi', 'Demo@123'],
];

const citizens = CITIZENS.map(([full_name, local, password], i) => {
  const user_id = i + 2;
  const created = daysAgo(90 - i * 2);
  return {
    ...baseUser,
    user_id,
    user_type_id: 2,
    notification_id: `User${user_id}`,
    email: `${local}@aathmabandhu.in`,
    password,
    full_name,
    aadhar_number: String(100000000000 + 111111 * (i + 1) + 7 * i).padStart(12, '0'),
    mobile: 9848000000 + (i + 1) * 1379,
    createdAt: created,
    updatedAt: created,
  };
});

export const users = [admin, ...citizens];

// ---------------------------------------------------------------------------
// Departments (sectors), officers and complaint templates
// ---------------------------------------------------------------------------
const SECTORS = {
  Electricity: [
    'Street light not working for over a week',
    'Frequent power cuts in the evening hours',
    'Transformer sparking near the school',
    'Electricity bill amount wrongly calculated',
    'Loose overhead wires hanging low on the road',
  ],
  'Water Supply': [
    'No drinking water supply for the past 3 days',
    'Contaminated / muddy water from municipal tap',
    'Pipeline leakage flooding the street',
    'Very low water pressure on the first floor',
    'New tap connection pending for 2 months',
  ],
  Roads: [
    'Large pothole near the bus stop causing accidents',
    'Road dug up for cable work and not restored',
    'Speed breaker required near the primary school',
    'Footpath encroached by shops',
    'Road waterlogged after every rain',
  ],
  Sanitation: [
    'Garbage not collected for 4 days',
    'Open drain overflowing on the main road',
    'Public toilet not cleaned regularly',
    'Stray dogs menace near garbage point',
    'Mosquito fogging required in the colony',
  ],
  Health: [
    'PHC doctor not available during OPD hours',
    'Medicines out of stock at government hospital',
    'Ambulance (108) delayed by over an hour',
    'Aarogyasri card not activated',
  ],
  Education: [
    'Mid-day meal quality poor at government school',
    'Scholarship amount not credited',
    'School building roof leaking',
    'Teacher vacancy in Mathematics not filled',
  ],
  'Revenue & Land Records': [
    'Income certificate application pending',
    'Mutation of land records delayed',
    'Caste certificate not issued after verification',
    'Error in pattadar passbook details',
  ],
  'Civil Supplies (Ration)': [
    'Ration not distributed this month',
    'New ration card application pending',
    'Fair price shop remains closed on working days',
    'Name missing from ration card after update',
  ],
  Pensions: [
    'Old age pension not received for 2 months',
    'Widow pension application pending',
    'Disability pension amount reduced without notice',
  ],
  Transport: [
    'Bus service to the village discontinued',
    'Driving licence not delivered after test',
    'RTC bus overcrowded during school hours',
  ],
};

// [name, email local part, sector]; every sector has 2 officers so load balancing is visible.
// Third element is officer_level (Junior | Senior | Lead) - used by
// services/agentAssignment.js-equivalent routing in mockServer.js so each
// department has a senior officer for higher-severity cases.
const OFFICERS = [
  ['Suresh Reddy', 'suresh.agent', 'Electricity', 'Lead'],
  ['Anita Rao', 'anita.agent', 'Electricity', 'Junior'],
  ['Kiran Naidu', 'kiran.agent', 'Water Supply', 'Lead'],
  ['Madhavi Latha', 'madhavi.agent', 'Water Supply', 'Junior'],
  ['Meena Iyer', 'meena.agent', 'Roads', 'Lead'],
  ['Rajashekar Goud', 'rajashekar.agent', 'Roads', 'Junior'],
  ['Arjun Das', 'arjun.agent', 'Sanitation', 'Lead'],
  ['Salma Sultana', 'salma.agent', 'Sanitation', 'Junior'],
  ['Dr. Pavan Kumar', 'pavan.agent', 'Health', 'Lead'],
  ['Dr. Sravani M', 'sravani.agent', 'Health', 'Junior'],
  ['Narsimha Chary', 'narsimha.agent', 'Education', 'Lead'],
  ['Vijaya Lakshmi', 'vijaya.agent', 'Education', 'Junior'],
  ['Ravinder Rao', 'ravinder.agent', 'Revenue & Land Records', 'Lead'],
  ['Shailaja P', 'shailaja.agent', 'Revenue & Land Records', 'Junior'],
  ['Yadagiri B', 'yadagiri.agent', 'Civil Supplies (Ration)', 'Lead'],
  ['Nirmala Devi', 'nirmala.agent', 'Civil Supplies (Ration)', 'Junior'],
  ['Satyanarayana M', 'satyanarayana.agent', 'Pensions', 'Lead'],
  ['Hymavathi S', 'hymavathi.agent', 'Pensions', 'Junior'],
  ['Venu Gopal', 'venu.agent', 'Transport', 'Lead'],
  ['Aruna Kumari', 'aruna.agent', 'Transport', 'Junior'],
];

export const agents = OFFICERS.map(([full_name, local, agent_sector, officer_level], i) => ({
  agent_id: i + 1,
  notification_id: `Agent${i + 1}`,
  user_type_id: 3,
  email: `${local}@aathmabandhu.in`,
  full_name,
  mobile: 9440000000 + (i + 1) * 2111,
  password: 'Agent@123',
  users_assigned: [],
  agent_sector,
  officer_level,
  // Base/office area, used for the admin map and nearest-officer routing
  // (see services/agentAssignment.js-equivalent in mockServer.js). Spread
  // across the same GHMC locations complaints are raised from.
  office_pincode: LOCATIONS[i % LOCATIONS.length][1],
  otp: null,
  otpExpiration: null,
  aadhar_number: String(100900000000 + (i + 1) * 104729).padStart(12, '0'),
  createdAt: daysAgo(150),
  updatedAt: daysAgo(150),
}));

// ---------------------------------------------------------------------------
// Supervisors - read-only monitor role (user_type_id 4). Each oversees one
// department's agents/complaints, except the last ("All Departments" - null
// monitors_sector), mirroring a district-level vs department-level government
// supervisor.
// ---------------------------------------------------------------------------
const SUPERVISORS = [
  ['Ramesh Varma', 'ramesh.super', 'Water Supply'],
  ['Lakshmi Prasanna', 'lakshmi.super', 'Roads'],
  ['Chief Supervisor', 'chief.super', null],
];

export const supervisors = SUPERVISORS.map(([full_name, local, monitors_sector], i) => ({
  supervisor_id: i + 1,
  notification_id: `Supervisor${i + 1}`,
  user_type_id: 4,
  email: `${local}@aathmabandhu.in`,
  full_name,
  mobile: 9900000000 + (i + 1) * 3187,
  password: 'Supervisor@123',
  monitors_sector,
  otp: null,
  otpExpiration: null,
  aadhar_number: String(100800000000 + (i + 1) * 104729).padStart(12, '0'),
  createdAt: daysAgo(100),
  updatedAt: daysAgo(100),
}));

// ---------------------------------------------------------------------------
// Complaints: open ones (pending / in-progress) plus closed ones that only survive
// as notifications (the real backend deletes a complaint when it is "completed").
// ---------------------------------------------------------------------------
const OPEN_COMPLAINTS = 72;
const CLOSED_COMPLAINTS = 38;

const usedIds = new Set();
const complaintId = () => {
  let id;
  do id = `SRV${String(Math.floor(rand() * 10000)).padStart(4, '0')}AB`;
  while (usedIds.has(id));
  usedIds.add(id);
  return id;
};

const sectorNames = Object.keys(SECTORS);

// Exported for mockServer.js's registerComplaint handler, so a complaint raised
// live through the app is classified/routed the same way as the seeded ones.
export { heuristicLevel, pickOfficer };

// Mirrors GovServiceAppBackend/services/caseLevelClassifier.js's fallback heuristic
// and agentAssignment.js's routing, so the seeded demo data is internally
// consistent with how a live complaint actually gets classified and assigned.
const HIGH_KEYWORDS = ['fire', 'accident', 'injury', 'death', 'collapse', 'sparking', 'live wire', 'flooding', 'flooded', 'contaminated', 'outbreak', 'gas leak', 'overcrowded'];
const MEDIUM_KEYWORDS = ['not working', 'leak', 'leakage', 'pothole', 'overflow', 'overflowing', 'delay', 'delayed', 'shortage', 'pending', 'no water', 'vacancy', 'roof leaking'];
const heuristicLevel = (notes) => {
  const text = String(notes || '').toLowerCase();
  if (HIGH_KEYWORDS.some((w) => text.includes(w))) return 'High';
  if (MEDIUM_KEYWORDS.some((w) => text.includes(w))) return 'Medium';
  return 'Low';
};
const LEVEL_RANK = { Junior: 1, Senior: 2, Lead: 3 };
const CASE_TO_OFFICER_LEVEL = { Low: 'Junior', Medium: 'Senior', High: 'Lead' };
const pickOfficer = (sector, caseLevel) => {
  const targetRank = LEVEL_RANK[CASE_TO_OFFICER_LEVEL[caseLevel]] || LEVEL_RANK.Junior;
  return agents
    .filter((a) => a.agent_sector === sector)
    .sort((a, b) => {
      const rankA = LEVEL_RANK[a.officer_level] || LEVEL_RANK.Junior;
      const rankB = LEVEL_RANK[b.officer_level] || LEVEL_RANK.Junior;
      const distA = Math.abs(rankA - targetRank) + (rankA < targetRank ? 0.5 : 0);
      const distB = Math.abs(rankB - targetRank) + (rankB < targetRank ? 0.5 : 0);
      return distA !== distB ? distA - distB : a.users_assigned.length - b.users_assigned.length;
    })[0];
};

export const complaints = [];
export const notifications = [];
let notifId = 0;
const notify = (notification_id, message, iso) =>
  notifications.push({
    id: ++notifId,
    notification_id,
    message,
    date: dateOf(iso),
    time: timeOf(iso),
    meet: null,
    createdAt: iso,
    updatedAt: iso,
  });

const closed = [];
for (let i = 0; i < OPEN_COMPLAINTS + CLOSED_COMPLAINTS; i++) {
  // The two headline demo citizens always get a handful of complaints each.
  const user = i < 4 ? citizens[0] : i < 7 ? citizens[1] : pick(citizens);
  const sector = i < 7 ? sectorNames[i] : pick(sectorNames);
  const notes = pick(SECTORS[sector]);
  const [complaint_address, complaint_pincode] = address(user.user_id + i);
  const isClosed = i >= OPEN_COMPLAINTS;
  const age = isClosed ? 20 + Math.floor(rand() * 40) : Math.floor(rand() * 30);
  const created = daysAgo(age, 9 + Math.floor(rand() * 9));
  const case_level = heuristicLevel(notes);
  const agent = pickOfficer(sector, case_level);
  const id = complaintId();

  notify(user.notification_id, `Your complaint ${id} (${sector}) has been registered and assigned to ${agent.full_name}.`, created);
  notify(agent.notification_id, `New complaint ${id} assigned to you: "${notes}" at ${complaint_address}.`, created);

  if (isClosed) {
    const done = daysAgo(Math.max(age - 3 - Math.floor(rand() * 6), 1), 16);
    notify(user.notification_id, `Complaint ${id} has been resolved by ${agent.full_name} and closed. Thank you for using Aathma Bandhu.`, done);
    closed.push(id);
    continue;
  }

  const status = age > 14 || rand() < 0.25 ? 'in-progress' : 'pending';
  const updated = status === 'in-progress' ? daysAgo(Math.max(age - 1, 0), 15) : created;
  if (status === 'in-progress') {
    notify(user.notification_id, `${agent.full_name} (${sector}) has started work on complaint ${id}.`, updated);
  }
  const complaint = {
    complaint_id: id,
    user_id: user.user_id,
    sector,
    notes,
    case_level,
    agent_id: agent.agent_id,
    status,
    complaint_address,
    complaint_pincode,
    pdfComplaint: '',
    createdAt: created,
    updatedAt: updated,
  };
  complaints.push(complaint);
  agent.users_assigned.push({ ...complaint });
}

// Admin-level updates.
notify('Admin1', `Weekly summary: ${complaints.length} open complaints, ${closed.length} resolved in the last 60 days.`, daysAgo(0, 9));
notify('Admin1', 'Electricity department has the highest number of open complaints this week.', daysAgo(1, 9));
notify('Admin1', 'Two new officers onboarded for Pensions department.', daysAgo(5, 11));
citizens.forEach((u, i) => {
  if (i % 3 === 0) notify(u.notification_id, 'Aathma Bandhu: you can now track your complaint status in real time.', daysAgo(10, 12));
});

// ---------------------------------------------------------------------------
// Mock Aadhaar registry used by the "Verify" button on the Sign Up screen.
// The first 11 entries are copied verbatim from GovServiceApp SignUp.js; the rest are
// realistic, not-yet-registered people for demoing sign-up live.
// ---------------------------------------------------------------------------
export const aadharData = [
  { aadharNumber: 123456789, fullName: 'Person1', phone: '9856321473' },
  { aadharNumber: 987456652, fullName: 'Person2', phone: '9856321437' },
  { aadharNumber: 852963741, fullName: 'Person3', phone: '9856323473' },
  { aadharNumber: 753951456, fullName: 'Person4', phone: '9856328989' },
  { aadharNumber: 556644882, fullName: 'Person5', phone: '8008649321' },
  { aadharNumber: 777666444, fullName: 'Person6', phone: '9855921473' },
  { aadharNumber: 774433665, fullName: 'Person7', phone: '9856321883' },
  { aadharNumber: 468273976, fullName: 'Person8', phone: '9856000473' },
  { aadharNumber: 563001487, fullName: 'Person9', phone: '9856321666' },
  { aadharNumber: 303606909, fullName: 'Person10', phone: '9888321473' },
  { aadharNumber: 956324170, fullName: 'Person11', phone: '9856555473' },
  { aadharNumber: '123412341234', fullName: 'Ramya Sri', phone: '9848012345' },
  { aadharNumber: '100020003000', fullName: 'Mahesh Goud', phone: '9848023456' },
  { aadharNumber: '100020003001', fullName: 'Sneha Reddy', phone: '9848034567' },
  { aadharNumber: '100020003002', fullName: 'Abdul Rahman', phone: '9848045678' },
  { aadharNumber: '100020003003', fullName: 'Keerthi Priya', phone: '9848056789' },
  { aadharNumber: '100020003004', fullName: 'Chandra Mohan', phone: '9848067890' },
  { aadharNumber: '100020003005', fullName: 'Pooja Kulkarni', phone: '9848078901' },
  { aadharNumber: '100020003006', fullName: 'Balaraju Kurma', phone: '9848089012' },
  { aadharNumber: '100020003007', fullName: 'Nandini Rao', phone: '9848090123' },
  { aadharNumber: '100020003008', fullName: 'Gopal Krishna', phone: '9848001234' },
];

export const seed = () => ({
  users: JSON.parse(JSON.stringify(users)),
  agents: JSON.parse(JSON.stringify(agents)),
  supervisors: JSON.parse(JSON.stringify(supervisors)),
  complaints: JSON.parse(JSON.stringify(complaints)),
  notifications: JSON.parse(JSON.stringify(notifications)),
  sessions: [],
});
