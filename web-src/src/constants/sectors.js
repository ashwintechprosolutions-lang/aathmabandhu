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

export const USER_TYPES = { ADMIN: 1, CITIZEN: 2, OFFICER: 3 };
