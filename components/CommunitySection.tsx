'use client';
import { useState } from 'react';

interface Post {
  title: string;
  url: string;
  subreddit: string;
  published: string;
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
    noResults: 'No community posts found',
    readMore: 'Read on Reddit →',
  },
  ar: {
    title: '💬 نقاشات المجتمع',
    subtitle: 'تجارب حقيقية من مجتمعات Reddit للميكانيكيين',
    load: 'تحميل مناقشات المجتمع',
    loading: 'جاري البحث في Reddit...',
    noResults: 'لا توجد مناقشات',
    readMore: 'اقرأ على Reddit →',
  },
  fr: {
    title: '💬 Discussions Communautaires',
    subtitle: 'Expériences réelles de r/MechanicAdvice, r/CarTalk, r/AutoRepair et plus',
    load: 'Charger les discussions',
    loading: 'Recherche sur Reddit...',
    noResults: 'Aucune discussion trouvée',
    readMore: 'Lire sur Reddit →',
  },
};

export default function CommunitySection({ code, locale }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.en;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/community?code=${code}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setLoaded(true);
    } catch {
      setPosts([]);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return '';
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
        <p style={{ color: '#6b7280', textAlign: 'center', fontSize: 14 }}>
          {labels.noResults}
        </p>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <p style={{
                  margin: 0, color: '#cbd5e1',
                  fontSize: 13, lineHeight: 1.4, flex: 1,
                }}>
                  {post.title}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6, alignItems: 'center' }}>
                <span style={{
                  background: '#ff63140d', border: '1px solid #ff631430',
                  borderRadius: 4, padding: '2px 8px',
                  color: '#ff9260', fontSize: 11,
                }}>
                  {post.subreddit}
                </span>
                {post.published && (
                  <span style={{ color: '#4b5563', fontSize: 11 }}>
                    {formatDate(post.published)}
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
