import { NextRequest, NextResponse } from 'next/server';

const CACHE = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.toUpperCase();
  const locale = req.nextUrl.searchParams.get('locale') || 'en';

  if (!code) {
    return NextResponse.json({ error: 'Code required' }, { status: 400 });
  }

  const cacheKey = `yt-${code}-${locale}`;
  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    // Search query based on locale
    const queries: Record<string, string> = {
      en: `${code} OBD fix repair`,
      ar: `${code} عطل سيارة إصلاح`,
      fr: `${code} code défaut réparation`,
    };
    const query = queries[locale] || queries.en;

    // If no YouTube API key, use YouTube RSS (no key needed!)
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'your_youtube_api_key') {
      // YouTube search via RSS — no API key needed
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?search_query=${encodeURIComponent(query)}`;

      const res = await fetch(rssUrl, {
        signal: AbortSignal.timeout(8000),
      });
      const xml = await res.text();

      const videos: unknown[] = [];
      const entryMatches = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g));

      for (const match of entryMatches) {
        const content = match[1];
        const title = content.match(/<title>([\s\S]*?)<\/title>/)?.[1]
          ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')?.trim();
        const videoId = content.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1]?.trim();
        const author = content.match(/<name>(.*?)<\/name>/)?.[1]?.trim();
        const published = content.match(/<published>(.*?)<\/published>/)?.[1]?.trim();
        const views = content.match(/<media:statistics[^>]*views="(\d+)"/)?.[1];

        if (title && videoId) {
          videos.push({
            title,
            videoId,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            channel: author,
            published,
            views: views ? parseInt(views).toLocaleString() : null,
          });
        }
      }

      const data = {
        code,
        videos: videos.slice(0, 4),
        query,
        source: 'YouTube',
        fetched_at: new Date().toISOString(),
      };

      CACHE.set(cacheKey, { data, timestamp: Date.now() });
      return NextResponse.json(data);
    }

    // If YouTube API key exists, use official API
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=4&key=${YOUTUBE_API_KEY}&relevanceLanguage=${locale}`;

    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) });
    const ytData = await res.json();

    const videos = (ytData.items || []).map((item: {
      id?: { videoId?: string };
      snippet?: {
        title?: string;
        channelTitle?: string;
        publishedAt?: string;
        thumbnails?: { medium?: { url?: string } };
        description?: string;
      };
    }) => ({
      title: item.snippet?.title,
      videoId: item.id?.videoId,
      url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
      thumbnail: item.snippet?.thumbnails?.medium?.url,
      channel: item.snippet?.channelTitle,
      published: item.snippet?.publishedAt,
      description: item.snippet?.description?.slice(0, 100),
    }));

    const data = {
      code,
      videos,
      query,
      source: 'YouTube',
      fetched_at: new Date().toISOString(),
    };

    CACHE.set(cacheKey, { data, timestamp: Date.now() });
    return NextResponse.json(data);

  } catch (error) {
    console.error('YouTube error:', error);
    return NextResponse.json({ code, videos: [], error: 'Could not fetch videos' });
  }
}
