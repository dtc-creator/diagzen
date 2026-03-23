'use client';
import { useState } from 'react';

interface Post {
  title: string;
  url: string;
  source: string;
  score: number;
  comments: number;
  date: string;
  author: string;
  preview: string;
}

interface Props {
  code: string;
  locale: string;
}

const LABELS = {
  en: {
    title: '💬 Community Discussions',
    subtitle: 'Real experiences from r/MechanicAdvice, r/CarTalk, r/AutoRepair & more',
    load: 'Load Community Posts',
    loading: 'Searching Reddit...',
    noResults: 'No community posts found for this code yet. Try searching Reddit directly.',
    readMore: 'Read on Reddit →',
    searchReddit: 'Search Reddit for ' ,
  },
  ar: {
    title: '💬 نقاشات المجتمع',
    subtitle: 'تجارب حقيقية من مجتمعات Reddit للميكانيكيين',
    load: 'تحميل مناقشات المجتمع',
    loading: 'جاري البحث في Reddit...',
    noResults: 'لا توجد مناقشات لهذا الرمز حتى الآن.',
    readMore: 'اقرأ على Reddit →',
    searchReddit: 'ابحث في Reddit عن ',
  },
  fr: {
    title: '💬 Discussions Communautaires',
    subtitle: 'Expériences réelles de r/MechanicAdvice, r/CarTalk, r/AutoRepair et plus',
    load: 'Charger les discussions',
    loading: 'Recherche sur Reddit...',
    noResults: 'Aucune discussion trouvée pour ce code. Essayez de chercher directement sur Reddit.',
    readMore: 'Lire sur Reddit →',
    searchReddit: 'Rechercher sur Reddit : ',
  },
};

const SUBREDDITS = ['MechanicAdvice', 'CarTalk', 'AskMechanics', 'AutoRepair', 'obd2'];

async function fetchSubreddit(sub: string, code: string): Promise<Post[]> {
  try {
    const url = `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(code)}&sort=relevance&limit=3&restrict_sr=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'DiagZen/1.0 diagnostic tool (https://diagzen.com)',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(8000),
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
      };
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
}

export default function CommunitySection({ code, locale }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.en;

  const load = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(SUBREDDITS.map((sub) => fetchSubreddit(sub, code)));
      const allPosts = results
        .flat()
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 6);
      setPosts(allPosts);
    } catch {
      setPosts([]);
    } finally {
      setLoaded(true);
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#111827',
      border: '1px solid #1e3a5f',
      borderRadius: 12,
      padding: 24,
      marginTop: 16,
    }}>
      <h3 style={{ margin: '0 0 4px', color: '#e2e8f0', fontSize: 18 }}>
        {labels.title}
      </h3>
      <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: 12 }}>
        {labels.subtitle}
      </p>

      {!loaded && !loading && (
        <button onClick={load} style={{
          background: 'linear-gradient(135deg, #ff6314, #e55a00)',
          border: 'none', borderRadius: 8,
          padding: '10px 20px', color: 'white',
          cursor: 'pointer', fontSize: 14, width: '100%',
        }}>
          {labels.load}
        </button>
      )}

      {loading && (
        <p style={{ color: '#60a5fa', textAlign: 'center', fontSize: 14 }}>
          ⏳ {labels.loading}
        </p>
      )}

      {loaded && posts.length === 0 && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 12 }}>
            {labels.noResults}
          </p>
          <a
            href={`https://www.reddit.com/search/?q=${encodeURIComponent(code)}+car+diagnostic`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#ff4500',
              borderRadius: 6,
              padding: '8px 16px',
              color: 'white',
              fontSize: 13,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            {labels.searchReddit}{code} on Reddit ↗
          </a>
        </div>
      )}

      {loaded && posts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {posts.map((post, i) => (
            <a
              key={i}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#0a0e1a',
                border: '1px solid #1e3a5f',
                borderRadius: 8,
                padding: 12,
                textDecoration: 'none',
                display: 'block',
              }}
            >
              <p style={{
                margin: '0 0 6px', color: '#cbd5e1',
                fontSize: 13, lineHeight: 1.4,
              }}>
                {post.title}
              </p>

              {post.preview && (
                <p style={{
                  margin: '0 0 8px', color: '#6b7280',
                  fontSize: 12, lineHeight: 1.4,
                }}>
                  {post.preview}{post.preview.length >= 120 ? '…' : ''}
                </p>
              )}

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  background: '#ff63140d', border: '1px solid #ff631430',
                  borderRadius: 4, padding: '2px 8px',
                  color: '#ff9260', fontSize: 11,
                }}>
                  {post.source}
                </span>
                <span style={{ color: '#f59e0b', fontSize: 11 }}>
                  ⬆ {post.score}
                </span>
                <span style={{ color: '#60a5fa', fontSize: 11 }}>
                  💬 {post.comments}
                </span>
                {post.date && (
                  <span style={{ color: '#4b5563', fontSize: 11 }}>
                    {post.date}
                  </span>
                )}
                <span style={{ color: '#3b82f6', fontSize: 11, marginLeft: 'auto' }}>
                  {labels.readMore}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
