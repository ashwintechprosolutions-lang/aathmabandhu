// Picks which officer a new complaint goes to, given its Claude-assessed case
// level (see caseLevelClassifier.js). Replaces the old "least-loaded officer in
// the sector" rule with "closest-ranked officer for this case level, tie-broken
// by least-loaded" - a High case prefers a Lead, a Low case prefers a Junior, but
// nobody is ever left unassigned just because the exact level isn't available.
const LEVEL_RANK = { Junior: 1, Senior: 2, Lead: 3 };
const CASE_TO_OFFICER_LEVEL = { Low: 'Junior', Medium: 'Senior', High: 'Lead' };

function pickOfficer(agents, caseLevel) {
  const targetRank = LEVEL_RANK[CASE_TO_OFFICER_LEVEL[caseLevel]] || LEVEL_RANK.Junior;
  const sorted = [...agents].sort((a, b) => {
    const rankA = LEVEL_RANK[a.officer_level] || LEVEL_RANK.Junior;
    const rankB = LEVEL_RANK[b.officer_level] || LEVEL_RANK.Junior;
    // Distance from the target rank; when no officer sits exactly at that rank,
    // prefer someone more senior over someone less senior (a small tie-breaking
    // penalty on the under-qualified side).
    const distA = Math.abs(rankA - targetRank) + (rankA < targetRank ? 0.5 : 0);
    const distB = Math.abs(rankB - targetRank) + (rankB < targetRank ? 0.5 : 0);
    if (distA !== distB) return distA - distB;
    return (a.users_assigned?.length || 0) - (b.users_assigned?.length || 0);
  });
  return sorted[0];
}

module.exports = { pickOfficer, LEVEL_RANK, CASE_TO_OFFICER_LEVEL };
