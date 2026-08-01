function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function HeroVideo({
  videoUrl,
  posterImage,
}: {
  videoUrl: string;
  posterImage: string;
}) {
  const youtubeId = videoUrl ? extractYouTubeId(videoUrl) : null;

  if (youtubeId) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1`}
          title="Background video"
          allow="autoplay; encrypted-media"
        />
      </div>
    );
  }

  if (!videoUrl) {
    return posterImage ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={posterImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
    ) : null;
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      poster={posterImage || undefined}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={videoUrl} type="video/mp4" />
    </video>
  );
}
