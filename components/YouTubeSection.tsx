'use client';
import { useState } from 'react';
import Image from 'next/image';

interface Video {
  title: string;
  videoId: string;
  url: string;
  thumbnail: string;
  channel: string;
  views?: string;
}

interface Props {
  code: string;
  locale: string;
}

const LABELS = {
  en: {
    title: '▶️ Repair Video Guides',
    subtitle: 'Watch how mechanics fix this fault',
    load: 'Load Repair Videos',
    loading: 'Finding repair videos...',
    watch: 'Watch on YouTube',
    noVideos: 'No videos found',
  },
  ar: {
    title: '▶️ فيديوهات الإصلاح',
    subtitle: 'شاهد كيف يصلح الميكانيكيون هذا العطل',
    load: 'تحميل فيديوهات الإصلاح',
    loading: 'جاري البحث عن الفيديوهات...',
    watch: 'شاهد على يوتيوب',
    noVideos: 'لا توجد فيديوهات',
  },
  fr: {
    title: '▶️ Guides Vidéo de Réparation',
    subtitle: 'Regardez comment les mécaniciens réparent ce défaut',
    load: 'Charger les vidéos',
    loading: 'Recherche de vidéos...',
    watch: 'Regarder sur YouTube',
    noVideos: 'Aucune vidéo trouvée',
  },
};

export default function YouTubeSection({ code, locale }: Props) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.en;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/youtube?code=${code}&locale=${locale}`);
      const data = await res.json();
      setVideos(data.videos || []);
      setLoaded(true);
    } catch {
      setVideos([]);
      setLoaded(true);
    } finally {
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
          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
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

      {loaded && videos.length === 0 && (
        <p style={{ color: '#6b7280', textAlign: 'center', fontSize: 14 }}>
          {labels.noVideos}
        </p>
      )}

      {loaded && videos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {videos.map((video, i) => (
            <a
              key={i}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#0a0e1a',
                border: '1px solid #1e3a5f',
                borderRadius: 8,
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                <Image
                  src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                  alt={video.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    background: 'rgba(220,38,38,0.9)',
                    borderRadius: '50%', width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>▶</div>
                </div>
              </div>
              <div style={{ padding: 10 }}>
                <p style={{
                  margin: '0 0 4px', color: '#cbd5e1',
                  fontSize: 12, lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {video.title}
                </p>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 11 }}>
                  {video.channel}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
