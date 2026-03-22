import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { code, locale = 'en', carMake = '', carModel = '', year = '' } = await req.json();
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    if (!code || !/^[PBCU][0-9]{4}$/i.test(code)) {
      return NextResponse.json({ error: 'Invalid DTC code format' }, { status: 400 });
    }

    const cacheKey = `${code.toUpperCase()}-${locale}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      system: `You are an expert automotive diagnostic technician with 20+ years experience.
Analyze OBD-II fault codes accurately. Always respond with valid JSON only, no markdown, no backticks.`,
      messages: [{
        role: 'user',
        content: `Analyze OBD-II code: ${code.toUpperCase()}
Car: ${carMake} ${carModel} ${year}
Locale: ${locale}

Respond ONLY with this JSON structure:
{
  "code": "${code.toUpperCase()}",
  "title_en": "short fault title in English",
  "title_ar": "عنوان العطل بالعربية",
  "title_fr": "titre en français",
  "severity": "critical or moderate or minor",
  "description_en": "2-3 sentence description",
  "description_ar": "وصف بالعربية",
  "description_fr": "description en français",
  "causes": [
    {"en": "cause 1", "ar": "سبب 1", "fr": "cause 1", "probability": 80}
  ],
  "symptoms": [
    {"en": "symptom", "ar": "عرض", "fr": "symptôme"}
  ],
  "workflow": [
    {"step": 1, "question_en": "question?", "question_ar": "سؤال؟", "yes_action": "do this", "no_action": "do that"}
  ],
  "parts_needed": [
    {"name_en": "part name", "name_ar": "اسم القطعة", "search_query": "part+name+for+car"}
  ],
  "diy_possible": true,
  "estimated_cost_usd": "$100-$300",
  "repair_time_hours": "1-2 hours"
}`
      }]
    });

    const text = response.content.map(b => 'text' in b ? b.text : '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);

    cache.set(cacheKey, { data, timestamp: Date.now() });
    return NextResponse.json(data);

  } catch (error) {
    console.error('Diagnose error:', error);
    return NextResponse.json({ error: 'Failed to diagnose. Please try again.' }, { status: 500 });
  }
}
