import { NextRequest, NextResponse } from 'next/server';

const CACHE = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.toUpperCase();
  const make = req.nextUrl.searchParams.get('make') || '';
  const model = req.nextUrl.searchParams.get('model') || '';

  if (!code) {
    return NextResponse.json({ error: 'Code required' }, { status: 400 });
  }

  const cacheKey = `nhtsa-${code}-${make}-${model}`;
  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    // NHTSA Complaints API — completely free, no key needed
    const res = await fetch(
      `https://api.nhtsa.gov/complaints/complaintsByVehicle?make=${encodeURIComponent(make || 'toyota')}&model=${encodeURIComponent(model || 'camry')}&modelYear=2020`,
      { signal: AbortSignal.timeout(8000) }
    );

    const nhtsaData = await res.json();

    // Filter complaints related to this DTC code
    const complaints = (nhtsaData.results || [])
      .filter((c: { cdescr?: string; components?: string }) =>
        c.cdescr?.toUpperCase().includes(code) ||
        c.components?.toUpperCase().includes('ENGINE') ||
        c.components?.toUpperCase().includes('FUEL')
      )
      .slice(0, 5)
      .map((c: {
        cdescr?: string;
        components?: string;
        crash?: boolean;
        fire?: boolean;
        injured?: number;
        deaths?: number;
      }) => ({
        description: c.cdescr?.slice(0, 200) + '...',
        component: c.components,
        crash: c.crash,
        fire: c.fire,
        injuries: c.injured,
        deaths: c.deaths,
      }));

    // Also fetch recalls
    const recallRes = await fetch(
      `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make || 'toyota')}&model=${encodeURIComponent(model || 'camry')}&modelYear=2020`,
      { signal: AbortSignal.timeout(8000) }
    );
    const recallData = await recallRes.json();

    const recalls = (recallData.results || [])
      .slice(0, 3)
      .map((r: {
        Component?: string;
        Summary?: string;
        Remedy?: string;
        ReportReceivedDate?: string;
      }) => ({
        component: r.Component,
        summary: r.Summary?.slice(0, 150) + '...',
        remedy: r.Remedy?.slice(0, 100) + '...',
        date: r.ReportReceivedDate,
      }));

    const data = {
      code,
      complaints_count: nhtsaData.count || 0,
      complaints: complaints,
      recalls_count: recallData.count || 0,
      recalls: recalls,
      source: 'NHTSA — National Highway Traffic Safety Administration',
      source_url: 'https://api.nhtsa.gov',
      fetched_at: new Date().toISOString(),
    };

    CACHE.set(cacheKey, { data, timestamp: Date.now() });
    return NextResponse.json(data);

  } catch (error) {
    console.error('NHTSA error:', error);
    return NextResponse.json({
      code,
      complaints_count: 0,
      complaints: [],
      recalls_count: 0,
      recalls: [],
      error: 'Could not fetch NHTSA data'
    });
  }
}
