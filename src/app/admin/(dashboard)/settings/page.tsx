import { getAllSiteSettings } from "@/lib/settings";
import { Field, TextInput, TextArea, Checkbox, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { VideoUpload } from "@/components/admin/video-upload";
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
            <VideoUpload
              name="heroVideoUrl"
              label="Hero Background Video (MP4, optional)"
              folder="hero"
              defaultValue={settings["homepage.hero"].videoUrl}
            />
            <ImageUpload
              name="heroPosterImage"
              label="Hero Fallback Image (shown if video doesn't load)"
              folder="hero"
              defaultValue={settings["homepage.hero"].posterImage}
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-neutral-900">About Page Content</h2>
          <div className="mt-3 space-y-4">
            <Field label="Our Vision" htmlFor="aboutVision">
              <TextArea id="aboutVision" name="aboutVision" defaultValue={settings["about.content"].vision} />
            </Field>
            <Field label="Our Mission" htmlFor="aboutMission">
              <TextArea id="aboutMission" name="aboutMission" defaultValue={settings["about.content"].mission} />
            </Field>
            <Field label="Our Commitment" htmlFor="aboutCoreValues">
              <TextArea
                id="aboutCoreValues"
                name="aboutCoreValues"
                defaultValue={settings["about.content"].coreValues}
              />
            </Field>
            <Field label="Why Choose Avepo" htmlFor="aboutWhyChooseUs">
              <TextArea
                id="aboutWhyChooseUs"
                name="aboutWhyChooseUs"
                defaultValue={settings["about.content"].whyChooseUs}
              />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-neutral-900">Analytics</h2>
          <p className="text-xs text-neutral-500">
            Paste your Google Analytics Measurement ID (e.g. G-XXXXXXXXXX) to enable tracking.
            Leave blank to disable.
          </p>
          <div className="mt-3">
            <Field label="GA Measurement ID" htmlFor="gaMeasurementId">
              <TextInput
                id="gaMeasurementId"
                name="gaMeasurementId"
                placeholder="G-XXXXXXXXXX"
                defaultValue={settings["analytics.ga"].gaMeasurementId}
              />
            </Field>
          </div>
        </section>

        <SubmitButton>Save Settings</SubmitButton>
      </form>
    </div>
  );
}
