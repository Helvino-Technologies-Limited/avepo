import DOMPurify from "isomorphic-dompurify";

/**
 * News/article bodies are authored via a contentEditable rich-text editor,
 * but the underlying Server Action accepts raw HTML in the POST body — an
 * account with create/update access (not just Super Admin) could otherwise
 * inject <script>/onerror handlers that would execute in every visitor's
 * browser. Sanitize on render so only safe formatting tags ever survive.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "b", "strong", "i", "em", "u", "ul", "ol", "li", "a", "span"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}
