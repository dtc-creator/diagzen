import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// In-memory cache with 24h TTL
interface CacheEntry {
  data: DiagnosisResult;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export interface DiagnosisResult {
  code: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  severity: 'critical' | 'moderate' | 'minor';
  description_en: string;
  description_ar: string;
  description_fr: string;
  causes: Array<{ en: string; ar: string; fr: string; probability: number }>;
  symptoms: Array<{ en: string; ar: string; fr: string }>;
  workflow: Array<{
    step: number;
    question_en: string;
    question_ar: string;
    question_fr: string;
    yes_next: number | null;
    no_next: number | null;
    yes_action: string;
    no_action: string;
  }>;
  parts_needed: Array<{ name_en: string; name_ar: string; name_fr: string; search_query: string }>;
  diy_possible: boolean;
  estimated_cost_usd: string;
  repair_time_hours: string;
}

function getCacheKey(code: string, carMake?: string, carModel?: string, year?: string) {
  return `${code.toUpperCase()}_${carMake ?? ''}_${carModel ?? ''}_${year ?? ''}`;
}

export async function diagnoseDTC(
  code: string,
  locale: string,
  carMake?: string,
  carModel?: string,
  year?: string,
): Promise<DiagnosisResult> {
  const key = getCacheKey(code, carMake, carModel, year);

  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const vehicleContext = [year, carMake, carModel].filter(Boolean).join(' ');

  const userMessage = `Diagnose OBD-II fault code: ${code.toUpperCase()}${vehicleContext ? ` for a ${vehicleContext}` : ''}.
Locale: ${locale}

Return ONLY valid JSON with this exact structure:
{
  "code": "${code.toUpperCase()}",
  "title_en": "short fault name in English",
  "title_ar": "short fault name in Arabic",
  "title_fr": "short fault name in French",
  "severity": "critical|moderate|minor",
  "description_en": "150-200 word technical description in English",
  "description_ar": "150-200 word technical description in Arabic",
  "description_fr": "150-200 word technical description in French",
  "causes": [
    {"en": "cause in English", "ar": "cause in Arabic", "fr": "cause in French", "probability": 85}
  ],
  "symptoms": [
    {"en": "symptom in English", "ar": "symptom in Arabic", "fr": "symptom in French"}
  ],
  "workflow": [
    {
      "step": 1,
      "question_en": "diagnostic question",
      "question_ar": "diagnostic question in Arabic",
      "question_fr": "diagnostic question in French",
      "yes_next": 2,
      "no_next": 3,
      "yes_action": "action if yes",
      "no_action": "action if no"
    }
  ],
  "parts_needed": [
    {"name_en": "part name", "name_ar": "part name in Arabic", "name_fr": "part name in French", "search_query": "amazon search query"}
  ],
  "diy_possible": true,
  "estimated_cost_usd": "$X-$Y",
  "repair_time_hours": "X-Y hours"
}

Include 5-7 causes ranked by probability, 4-6 symptoms, 4-6 workflow steps, and 2-3 parts needed.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1200,
    system: `You are an expert automotive diagnostic technician with 20+ years experience.
Provide accurate, detailed OBD-II fault code analysis.
Always respond in the language specified by locale field (en/ar/fr).
Be technical but understandable.
Return ONLY valid JSON, no markdown, no extra text.`,
    messages: [{ role: 'user', content: userMessage }],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API');
  }

  const result: DiagnosisResult = JSON.parse(content.text);

  cache.set(key, { data: result, timestamp: Date.now() });

  return result;
}

export async function diagnoseSymptom(
  symptom: string,
  locale: string,
): Promise<{ codes: string[]; descriptions: Record<string, string> }> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 400,
    system: 'You are an expert automotive diagnostic technician. Return ONLY valid JSON, no markdown.',
    messages: [{
      role: 'user',
      content: `For the symptom "${symptom}", list the 5 most likely OBD-II fault codes.
Return JSON: {"codes": ["P0XXX", ...], "descriptions": {"P0XXX": "brief reason in ${locale} language"}}`,
    }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response');
  return JSON.parse(content.text);
}
