import { NextRequest, NextResponse } from 'next/server';
import { diagnoseSymptom } from '@/lib/claude';

export async function POST(req: NextRequest) {
  try {
    const { symptom, locale = 'en' } = await req.json();
    if (!symptom) {
      return NextResponse.json({ error: 'symptom is required' }, { status: 400 });
    }
    const result = await diagnoseSymptom(symptom, locale);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Symptoms API error:', error);
    return NextResponse.json({ error: 'Failed to analyze symptom.' }, { status: 500 });
  }
}
