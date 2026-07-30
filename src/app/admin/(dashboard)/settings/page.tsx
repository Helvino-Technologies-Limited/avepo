import { getAllSiteSettings } from "@/lib/settings";
import { Field, TextInput, TextArea, Checkbox, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { updateSiteSettings } from "./actions";

export default async function SiteSettingsPage() {
  const settings = await getAllSiteSettings();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-neutral-900">Site Settings</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Controls branding, theme, contact info, social links, floating widgets, and the homepage
        hero — reflected across the public site immediately after saving.
      </p>

      <form action={updateSiteSettings} className="mt-6 space-y-8">
        <section>
          <h2 className="text-sm font-semibold text-neutral-900">Branding</h2>
          <div className="mt-3">
            <ImageUpload
              name="logoUrl"
              label="Site Logo"
              folder="branding"
              defaultValue={settings["branding.logo"].url}
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-neutral-900">Theme Colors</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <Field label="Primary" htmlFor="primaryColor">
              <TextInput
                id="primaryColor"
                name="primaryColor"
                type="color"
                defaultValue={settings["theme.colors"].primary}
              />
            </Field>
            <Field label="Secondary" htmlFor="secondaryColor">
              <TextInput
                id="secondaryColor"
                name="secondaryColor"
                type="color"
                defaultValue={settings["theme.colors"].secondary}
              />
            </Field>
            <Field label="Accent" htmlFor="accentColor">
              <TextInput
                id="accentColor"
                name="accentColor"
                type="color"
                defaultValue={settings["theme.colors"].accent}
              />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-neutral-900">General Contact</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Phone" htmlFor="contactPhone">
              <TextInput id="contactPhone" name="contactPhone" defaultValue={settings["contact.general"].phone} />
            </Field>
            <Field label="Email" htmlFor="contactEmail">
              <TextInput id="contactEmail" name="contactEmail" defaultValue={settings["contact.general"].email} />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-neutral-900">Social Links</h2>
          <p className="text-xs text-neutral-500">
            WhatsApp: enter digits only with country code (e.g. 254712345678) for the floating chat button.
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {(
              [
                ["facebook", "Facebook"],
                ["instagram", "Instagram"],
                ["tiktok", "TikTok"],
                ["linkedin", "LinkedIn"],
                ["twitter", "Twitter / X"],
                ["youtube", "YouTube"],
                ["whatsapp", "WhatsApp Number"],
                ["telegram", "Telegram"],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label} htmlFor={key}>
                <TextInput id={key} name={key} defaultValue={settings["social.links"][key]} />
              </Field>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-neutral-900">Floating Widgets</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Checkbox
              name="widgetWhatsapp"
              label="WhatsApp"
              defaultChecked={settings["widgets.floating"].whatsapp}
            />
            <Checkbox name="widgetCall" label="Call" defaultChecked={settings["widgets.floating"].call} />
            <Checkbox
              name="widgetMessenger"
              label="Messenger"
              defaultChecked={settings["widgets.floating"].messenger}
            />
            <Checkbox
              name="widgetBackToTop"
              label="Back to Top"
              defaultChecked={settings["widgets.floating"].backToTop}
            />
            <Checkbox
              name="widgetLiveChat"
              label="Live Chat"
              defaultChecked={settings["widgets.floating"].liveChat}
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-neutral-900">Homepage Hero</h2>
          <div className="mt-3 space-y-4">
            <Field label="Headline" htmlFor="heroHeadline">
              <TextInput id="heroHeadline" name="heroHeadline" defaultValue={settings["homepage.hero"].headline} />
            </Field>
            <Field label="Subheadline" htmlFor="heroSubheadline">
              <TextArea
                id="heroSubheadline"
                name="heroSubheadline"
                defaultValue={settings["homepage.hero"].subheadline}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button Label" htmlFor="heroCtaLabel">
                <TextInput id="heroCtaLabel" name="heroCtaLabel" defaultValue={settings["homepage.hero"].ctaLabel} />
              </Field>
              <Field label="Button Link" htmlFor="heroCtaHref">
                <TextInput id="heroCtaHref" name="heroCtaHref" defaultValue={settings["homepage.hero"].ctaHref} />
              </Field>
            </div>
          </div>
        </section>

        <SubmitButton>Save Settings</SubmitButton>
      </form>
    </div>
  );
}
