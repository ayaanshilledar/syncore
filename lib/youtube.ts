const YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;

export interface YouTubeMetadata {
  videoId: string;
  url: string;
  title: string;
  author: string | null;
  thumbnailUrl: string;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.trim().match(YOUTUBE_REGEX);
  return match ? match[1] : null;
}

export async function fetchYouTubeMetadata(
  videoId: string
): Promise<YouTubeMetadata> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const defaultThumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
      watchUrl
    )}&format=json`;

    const res = await fetch(oembedUrl, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        videoId,
        url: watchUrl,
        title: data.title || "YouTube Video",
        author: data.author_name || null,
        thumbnailUrl: data.thumbnail_url || defaultThumbnail,
      };
    }
  } catch {
    // Fallback if oembed request fails
  }

  return {
    videoId,
    url: watchUrl,
    title: `YouTube Video (${videoId})`,
    author: null,
    thumbnailUrl: defaultThumbnail,
  };
}
