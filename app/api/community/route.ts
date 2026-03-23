import { NextRequest, NextResponse } from 'next/server';

const CACHE = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 6 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.toUpperCase();
  const locale = req.nextUrl.searchParams.get('locale') || 'en';

  if (!code) {
    return NextResponse.json({ error: 'Code required' }, { status: 400 });
  }

  const cacheKey = `community-${code}-${locale}`;
  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const subreddits = [
      'MechanicAdvice',
      'CarTalk',
      'AskMechanics',
      'AutoRepair',
      'obd2'
    ];

    const results = await Promise.all(
      subreddits.map(async (sub) => {
        try {
          const url = `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(code)}&sort=relevance&limit=3&restrict_sr=1`;
          const res = await fetch(url, {
            headers: {
              'User-Agent': 'DiagZen/1.0 diagnostic tool (https://diagzen.com)',
              'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(6000),
          });

          if (!res.ok) return [];

          const data = await res.json();
          const posts = data?.data?.children || [];

          return posts.map((p: {
            data: {
              title: string;
              permalink: string;
              score: number;
              num_comments: number;
              created_utc: number;
              author: string;
              selftext: string;
            }
          }) => ({
            title: p.data.title,
            url: `https://www.reddit.com${p.data.permalink}`,
            score: p.data.score,
            comments: p.data.num_comments,
            date: new Date(p.data.created_utc * 1000).toLocaleDateString(),
            author: p.data.author,
            preview: p.data.selftext?.slice(0, 120) || '',
            source: `r/${sub}`,
          }));
        } catch {
          return [];
        }
      })
    );

    const allPosts = results
      .flat()
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 6);

    const data = {
      code,
      posts: allPosts,
      fetched_at: new Date().toISOString(),
    };

    CACHE.set(cacheKey, { data, timestamp: Date.now() });
    return NextResponse.json(data);

  } catch (error) {
    console.error('Reddit error:', error);
    return NextResponse.json({ code, posts: [] });
  }
}
