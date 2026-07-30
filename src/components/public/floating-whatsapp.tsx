import { getSiteSetting } from "@/lib/settings";

export async function FloatingWhatsApp() {
  const [widgets, social] = await Promise.all([
    getSiteSetting("widgets.floating"),
    getSiteSetting("social.links"),
  ]);

  const digits = social.whatsapp.replace(/\D/g, "");
  if (!widgets.whatsapp || !digits) return null;

  const prefilledText = encodeURIComponent(widgets.whatsappMessage || "");

  return (
    <a
      href={`https://wa.me/${digits}${prefilledText ? `?text=${prefilledText}` : ""}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="h-8 w-8">
        <path d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.39.63 4.62 1.72 6.55L4 29l7.62-1.66a11.9 11.9 0 0 0 4.39.83h.01c6.63 0 12.01-5.38 12.01-12.02C28 8.38 22.64 3 16.01 3zm0 21.8c-1.42 0-2.79-.35-4-1l-.29-.17-4.5.98.96-4.39-.19-.3a9.7 9.7 0 0 1-1.5-5.16c0-5.4 4.4-9.8 9.82-9.8 5.4 0 9.8 4.4 9.8 9.8s-4.4 9.84-9.82 9.84zm5.4-7.35c-.29-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.29-.77.96-.94 1.15-.17.2-.35.22-.64.07-.29-.15-1.23-.45-2.34-1.44-.87-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.35.44-.52.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.12-.26-.19-.55-.34z" />
      </svg>
    </a>
  );
}
