import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Montserrat, Rock_Salt, Bebas_Neue } from "next/font/google";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import { config } from "@/bigwatermarine/lib/config";
import { SITE, BUSINESS, siteGraph } from "@/bigwatermarine/lib/seo";
import { BRANDS } from "@/config/brands";
import "@/bigwatermarine/styles/base.css";
import "@/bigwatermarine/styles/site.css";
import "@/bigwatermarine/styles/pages.css";

// bigwatermarine.com has its own design and page set, so it lives in this
// static segment instead of the shared /sites/[brand] templates. Middleware
// rewrites bigwatermarine.com/* to /sites/bigwatermarine/*.

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const rockSalt = Rock_Salt({ subsets: ["latin"], weight: "400", variable: "--font-rocksalt", display: "swap" });
// Fallback for Veneer (loaded from the Adobe Fonts kit below).
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" });

const brand = BRANDS.bigwatermarine;

// Stays static (ISR) by never reading the request: preview hosts get a
// noindex header from middleware, and analytics checks the hostname in the browser.
export const metadata: Metadata = {
    metadataBase: new URL(SITE),
    title: {
      default: "Big Water Marine | Lake Texoma Boat Dealer, Service & Boat Club · Pottsboro, TX",
      template: "%s | Big Water Marine",
    },
    description: BUSINESS.description,
    applicationName: BUSINESS.name,
    formatDetection: { telephone: true, address: true },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: { siteName: BUSINESS.name, locale: "en_US", type: "website" },
    icons: { icon: "/bigwatermarine/brand/logo-grey-teal.png" },
};

export const viewport: Viewport = { themeColor: "#062538" };

// Google Tag Manager container carried over from the WordPress site, loaded
// only on the real domain so previews don't pollute reporting.
const gtm = brand.gtmId;
const gtmSnippet = gtm
  ? `if(/(^|\\.)bigwatermarine\\.com$/.test(location.hostname)){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');}`
  : null;

export default function BigWaterMarineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`bwm-site bwm-root ${montserrat.variable} ${rockSalt.variable} ${bebas.variable}`}>
      <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
      <link rel="stylesheet" href="https://use.typekit.net/cta4sca.css" />
      {gtmSnippet && <Script id="bwm-gtm" strategy="afterInteractive">{gtmSnippet}</Script>}
      <JsonLd data={siteGraph()} />
      <Header phone={config.phone} phoneHref={`tel:${config.phoneE164}`} windlassUrl={config.windlassIntakeUrl} promo={config.promo} hours={config.hours} />
      <main id="main">{children}</main>
      <Footer />
      {/* Dockline: text-message conversations instead of contact forms. */}
      <Script src={config.docklineSrc} data-site={config.docklineSite} strategy="lazyOnload" />
    </div>
  );
}
