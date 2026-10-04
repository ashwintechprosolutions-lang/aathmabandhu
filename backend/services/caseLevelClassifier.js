// Uses Claude to triage how urgently a complaint needs attention, so it can be
// routed to an officer of a matching seniority (see agentAssignment.js).
//
// Requires ANTHROPIC_API_KEY (see .env.example). Without it - or if the Claude
// call fails or times out for any reason - this falls back to a plain keyword
// heuristic instead, so a Claude outage or a not-yet-configured key never blocks
// a citizen from registering a complaint.
const { z } = require('zod');

const LEVELS = ['Low', 'Medium', 'High'];

const CaseLevelSchema = z.object({
  level: z.enum(LEVELS),
  reason: z.string(),
});

let client = null;
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) {
    // Lazy require: keeps startup working even before `npm install` has pulled
    // in @anthropic-ai/sdk on an older deployment.
    const Anthropic = require('@anthropic-ai/sdk');
    client = new Anthropic();
  }
  return client;
}

const HIGH_KEYWORDS = ['fire', 'accident', 'injury', 'injured', 'death', 'collapse', 'sparking', 'live wire', 'exposed wire', 'flooding', 'flooded', 'contaminated', 'outbreak', 'gas leak', 'electrocut'];
const MEDIUM_KEYWORDS = ['not working', 'leak', 'leakage', 'pothole', 'overflow', 'overflowing', 'delay', 'delayed', 'shortage', 'pending', 'no water', 'no power', 'power cut'];

function heuristicLevel(notes) {
  const text = String(notes || '').toLowerCase();
  if (HIGH_KEYWORDS.some((w) => text.includes(w))) return 'High';
  if (MEDIUM_KEYWORDS.some((w) => text.includes(w))) return 'Medium';
  return 'Low';
}

async function classifyCaseLevel({ sector, notes, complaint_address }) {
  const anthropic = getClient();
  if (!anthropic) return heuristicLevel(notes);

  try {
    const { zodOutputFormat } = require('@anthropic-ai/sdk/helpers/zod');
    const response = await anthropic.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 1024,
      output_config: {
        effort: 'low',
        format: zodOutputFormat(CaseLevelSchema),
      },
      system:
        'You triage government service complaints for a citizen grievance system. ' +
        'Classify how urgently the described issue needs attention:\n' +
        '"Low" - minor or non-urgent (e.g. a cosmetic issue, a routine request).\n' +
        '"Medium" - affects daily life and should be handled soon, but is not dangerous.\n' +
        '"High" - involves safety, health risk, or a severe/widespread service failure.\n' +
        'Be decisive. Give a one-sentence reason.',
      messages: [
        {
          role: 'user',
          content: `Department: ${sector}\nLocation: ${complaint_address}\nComplaint: ${notes}`,
        },
      ],
    });
    if (response.parsed_output) return response.parsed_output.level;
    console.error('Claude case classification returned no parsed output, using heuristic fallback');
    return heuristicLevel(notes);
  } catch (error) {
    console.error('Claude case classification failed, using heuristic fallback:', error.message);
    return heuristicLevel(notes);
  }
}

module.exports = { classifyCaseLevel, heuristicLevel, LEVELS };
