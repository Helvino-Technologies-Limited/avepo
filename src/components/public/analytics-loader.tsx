"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getStoredConsent } from "@/components/public/cookie-consent";

export function AnalyticsLoader({ gaMeasurementId }: { gaMeasurementId: string }) {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    function check() {
      setCanLoad(getStoredConsent() === "accepted");
    }
    check();
    window.addEventListener("avepo-consent-changed", check);
    return () => window.removeEventListener("avepo-consent-changed", check);
  }, []);

  if (!gaMeasurementId || !canLoad) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaMeasurementId}');
        `}
      </Script>
    </>
  );
}
