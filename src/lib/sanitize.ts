import sanitizeHtmlLib from "sanitize-html";

/**
 * News/article bodies are authored via a contentEditable rich-text editor,
 * but the underlying Server Action accepts raw HTML in the POST body — an
 * account with create/update access (not just Super Admin) could otherwise
 * inject <script>/onerror handlers that would execute in every visitor's
 * browser. Sanitize on render so only safe formatting tags ever survive.
 *
 * Uses sanitize-html (no jsdom dependency) rather than isomorphic-dompurify —
 * dompurify's jsdom-based server path doesn't reliably survive Vercel's
 * serverless function file-tracing (worked locally, 500'd in production).
 */
export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: ["p", "br", "b", "strong", "i", "em", "u", "ul", "ol", "li", "a", "span"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
