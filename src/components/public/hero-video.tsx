export function HeroVideo({
  videoUrl,
  posterImage,
}: {
  videoUrl: string;
  posterImage: string;
}) {
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
