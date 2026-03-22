import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { symptom, locale = 'en' } = await req.json();
    if (!symptom) {
      return NextResponse.json({ error: 'Symptom is required' }, { status: 400 });
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      system: 'You are an expert automotive diagnostic technician. Respond with valid JSON only, no markdown, no backticks.',
      messages: [{
        role: 'user',
        content: `A car has this symptom: "${symptom}"
Locale: ${locale}

Return ONLY this JSON:
{
  "symptom_en": "symptom in english",
  "symptom_ar": "العرض بالعربية",
  "symptom_fr": "symptôme en français",
  "likely_codes": [
    {
      "code": "P0300",
      "title_en": "fault title",
      "title_ar": "عنوان العطل",
      "title_fr": "titre",
      "probability": 85,
      "severity": "critical",
      "brief_en": "one sentence explanation",
      "brief_ar": "شرح مختصر",
      "brief_fr": "explication courte"
    }
  ],
  "quick_checks": [
    {"en": "check this first", "ar": "تحقق من هذا أولاً", "fr": "vérifiez ceci"}
  ]
}

Return 4-6 likely_codes ranked by probability, and 3-5 quick_checks.`,
      }]
    });

    const text = response.content.map(b => 'text' in b ? b.text : '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Symptoms API error:', error);
    return NextResponse.json({ error: 'Failed to analyze symptom.' }, { status: 500 });
  }
}
