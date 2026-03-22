import { NextRequest, NextResponse } from 'next/server';

const CACHE = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

const RSS_SOURCES = [
  {
    name: 'r/MechanicAdvice',
    url: 'https://www.reddit.com/r/MechanicAdvice/search.rss?q={CODE}&sort=relevance&limit=3',
  },
  {
    name: 'r/CarTalk',
    url: 'https://www.reddit.com/r/CarTalk/search.rss?q={CODE}&sort=relevance&limit=3',
  },
  {
    name: 'r/AskMechanics',
    url: 'https://www.reddit.com/r/AskMechanics/search.rss?q={CODE}&sort=relevance&limit=3',
  },
  {
    name: 'r/AutoRepair',
    url: 'https://www.reddit.com/r/AutoRepair/search.rss?q={CODE}&sort=relevance&limit=3',
  },
  {
    name: 'r/obd2',
    url: 'https://www.reddit.com/r/obd2/search.rss?q={CODE}&sort=relevance&limit=3',
  },
];

interface RedditPost {
  title: string;
  url: string;
  subreddit: string;
  published: string;
}

async function fetchRSS(source: { name: string; url: string }, code: string): Promise<RedditPost[]> {
  const url = source.url.replace('{CODE}', encodeURIComponent(code));
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'DiagZen/1.0 OBD2 diagnostic tool' },
      signal: AbortSignal.timeout(6000),
    });
    const xml = await res.text();
    const posts: RedditPost[] = [];
    const entryMatches = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g));

    for (const match of entryMatches) {
      const content = match[1];
      const title = content.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]
        ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        ?.replace(/&amp;/g, '&')
        ?.replace(/&lt;/g, '<')
        ?.replace(/&gt;/g, '>')
        ?.trim();
      const link = content.match(/<link[^>]*href="([^"]+)"/)?.[1]?.trim();
      const published = content.match(/<published>(.*?)<\/published>/)?.[1]?.trim();

      if (title && link && !title.toLowerCase().includes('search results')) {
        posts.push({ title, url: link, subreddit: source.name, published: published ?? '' });
      }
    }
    return posts;
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.toUpperCase();

  if (!code) {
    return NextResponse.json({ error: 'Code required' }, { status: 400 });
  }

  const cacheKey = `community-${code}`;
  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const results = await Promise.allSettled(
    RSS_SOURCES.map((source) => fetchRSS(source, code))
  );

  const posts: RedditPost[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      posts.push(...result.value);
    }
  }

  const data = {
    code,
    posts: posts.slice(0, 10),
    total: posts.length,
    sources: RSS_SOURCES.map((s) => s.name),
    fetched_at: new Date().toISOString(),
  };

  CACHE.set(cacheKey, { data, timestamp: Date.now() });
  return NextResponse.json(data);
}
