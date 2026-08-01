import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

const FROM_ADDRESS = process.env.EMAIL_FROM || "Avepo Agrovets <onboarding@resend.dev>";

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function wrapHtml(title: string, bodyHtml: string, unsubscribeUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #3f6b47;">${title}</h2>
      ${bodyHtml}
      <p style="margin-top: 32px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 12px;">
        You're receiving this because you subscribed to Avepo Agrovets updates.
        <a href="${unsubscribeUrl}" style="color: #888;">Unsubscribe</a>
      </p>
    </div>
  `;
}

/**
 * Emails every active subscriber. No-ops (logs, doesn't throw) if RESEND_API_KEY
 * isn't configured yet, so publishing content never fails just because email
 * hasn't been wired up.
 */
export async function notifySubscribers(subject: string, bodyHtml: string) {
  const client = getClient();
  if (!client) {
    console.log(`[email] RESEND_API_KEY not set — skipping notification: "${subject}"`);
    return;
  }

  const subscribers = await prisma.subscriber.findMany({
    where: { isActive: true },
    select: { email: true },
  });
  if (subscribers.length === 0) return;

  // Resend's batch send caps at 100 recipients per call.
  const chunkSize = 100;
  for (let i = 0; i < subscribers.length; i += chunkSize) {
    const chunk = subscribers.slice(i, i + chunkSize);
    await Promise.allSettled(
      chunk.map((s) =>
        client.emails.send({
          from: FROM_ADDRESS,
          to: s.email,
          subject,
          html: wrapHtml(subject, bodyHtml, `${SITE_URL}/unsubscribe?email=${encodeURIComponent(s.email)}`),
        })
      )
    );
  }
}
