// Government departments a complaint can be raised against (complaint.sector / agent.agent_sector).
export const SECTORS = [
  'Electricity',
  'Water Supply',
  'Roads',
  'Sanitation',
  'Health',
  'Education',
  'Revenue & Land Records',
  'Civil Supplies (Ration)',
  'Pensions',
  'Transport',
];

// complaint.status values used by the backend. "completed" deletes the complaint server-side.
export const STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

// OFFICER (3) is the backend's "Agent" role - the one who resolves complaints
// (the UI happens to label it "Officer"). SUPERVISOR (4) is a separate,
// read-only monitor role - oversees a department's agents/complaints (or all
// departments) but never resolves anything itself.
export const USER_TYPES = { ADMIN: 1, CITIZEN: 2, OFFICER: 3, SUPERVISOR: 4 };
