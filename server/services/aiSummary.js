const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function calculateAge(dob) {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function buildSummaryPrompt(patient, intakeForm, pastVisits) {
  const age = calculateAge(patient.dob);

  const pastVisitsText = pastVisits.length > 0
    ? pastVisits.map(v => `- ${new Date(v.date).toLocaleDateString()}: ${v.reasonForVisit || 'Visit'}${v.diagnosisNotes ? ' — ' + v.diagnosisNotes : ''}`).join('\n')
    : 'No past visit records.';

  const systemPrompt = `You are a clinical summarization assistant helping a doctor prepare for a patient visit. Summarize the following patient information into a concise, structured, doctor-readable pre-visit brief.

STRICT RULES:
- Do NOT diagnose any condition.
- Do NOT suggest treatment changes or new medications.
- Do NOT speculate beyond the data provided.
- Only summarize and highlight relevant patterns from the existing information.
- Keep the summary under 150 words.
- Structure it with short sections: Reason for Visit, Relevant History, Current Medications, Allergies to Note, and Patterns Worth Flagging (only if genuinely present in the data).`;

  const userPrompt = `Patient: ${patient.name}, ${age} years old, ${patient.gender}

Chronic Conditions: ${patient.chronicConditions.length ? patient.chronicConditions.join(', ') : 'None recorded'}
Current Medications: ${patient.currentMedications.length ? patient.currentMedications.join(', ') : 'None recorded'}
Allergies: ${patient.allergies.length ? patient.allergies.join(', ') : 'None recorded'}

Today's Intake:
- Reason for visit: ${intakeForm?.reasonForVisit || 'Not specified'}
- Reported symptoms: ${intakeForm?.symptoms || 'Not specified'}

Past Visits:
${pastVisitsText}

Please generate the pre-visit summary now.`;

  return { systemPrompt, userPrompt };
}

async function generateAISummary(patient, intakeForm, pastVisits) {
  const { systemPrompt, userPrompt } = buildSummaryPrompt(patient, intakeForm, pastVisits);

  const response = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 400,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock || !textBlock.text) {
    throw new Error('Empty response from Claude');
  }

  return textBlock.text.trim();
}

function generateFallbackSummary(patient, intakeForm, pastVisits) {
  const age = calculateAge(patient.dob);
  const lines = [];

  lines.push(`${patient.name}, ${age}, ${patient.gender}`);
  lines.push('');
  lines.push(`Reason for Visit: ${intakeForm?.reasonForVisit || 'Not specified'}`);
  lines.push(`Reported Symptoms: ${intakeForm?.symptoms || 'Not specified'}`);
  lines.push('');
  lines.push(`Chronic Conditions: ${patient.chronicConditions.length ? patient.chronicConditions.join(', ') : 'None recorded'}`);
  lines.push(`Current Medications: ${patient.currentMedications.length ? patient.currentMedications.join(', ') : 'None recorded'}`);
  lines.push(`Allergies: ${patient.allergies.length ? patient.allergies.join(', ') : 'None recorded'}`);

  if (pastVisits.length > 0) {
    lines.push('');
    lines.push('Recent Past Visits:');
    pastVisits.slice(0, 3).forEach(v => {
      lines.push(`- ${new Date(v.date).toLocaleDateString()}: ${v.reasonForVisit || 'Visit'}${v.diagnosisNotes ? ' — ' + v.diagnosisNotes : ''}`);
    });
  }

  return lines.join('\n');
}

async function getPatientSummary(patient, intakeForm, pastVisits) {
  try {
    const text = await generateAISummary(patient, intakeForm, pastVisits);
    return { text, source: 'claude' };
  } catch (err) {
    console.error('Claude API failed, using fallback:', err.message);
    const text = generateFallbackSummary(patient, intakeForm, pastVisits);
    return { text, source: 'fallback' };
  }
}

module.exports = { getPatientSummary, buildSummaryPrompt, generateAISummary, generateFallbackSummary };