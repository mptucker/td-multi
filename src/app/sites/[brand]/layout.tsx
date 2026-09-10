import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { BRAND_SLUGS, isBrandSlug } from "@/config/brands";
import { getAlert, getBrand, getContent } from "@/lib/content";
import { BrandStyle } from "@/components/BrandProvider";
import { AlertBar, Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BrandEntityJsonLd } from "@/components/Sections";
import { MembershipBand } from "@/components/MembershipBand";
import { absoluteBrandAsset, BRAND_TOPICS, isPreviewHost } from "@/lib/seo";

export const revalidate = 60; // ISR: CMS edits appear within a minute

type Params = { params: Promise<{ brand: string }> };

export function generateStaticParams() {
  return BRAND_SLUGS.map((brand) => ({ brand }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { brand: slug } = await params;
  if (!isBrandSlug(slug)) return {};
  const brand = getBrand(slug);
  const c = await getContent(slug);
  const host = (await headers()).get("host");
  const preview = isPreviewHost(host, [brand.canonicalDomain, `www.${brand.canonicalDomain}`]);
  const image = absoluteBrandAsset(brand.canonicalDomain, c.seo.ogImage);
  return {
    metadataBase: new URL(`https://${brand.canonicalDomain}`),
    title: { default: c.seo.title, template: `%s | ${brand.nap.displayName}` },
    description: c.seo.description,
    keywords: BRAND_TOPICS[brand.slug],
    alternates: { canonical: "/" },
    openGraph: { title: c.seo.title, description: c.seo.description, url: "/", images: [{ url: image, alt: brand.nap.displayName }], siteName: brand.nap.displayName, locale: "en_US", type: "website" },
    twitter: { card: "summary_large_image", title: c.seo.title, description: c.seo.description, images: [image] },
    icons: { icon: brand.logo.src },
    robots: preview
      ? { index: false, follow: false, noarchive: true, nocache: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    category: "travel",
  };
}

export default async function BrandLayout({ children, params }: { children: ReactNode } & Params) {
  const { brand: slug } = await params;
  if (!isBrandSlug(slug)) notFound();
  const brand = getBrand(slug);
  const [content, alert] = await Promise.all([getContent(slug), getAlert(slug)]);
  const gtm = brand.gtmId ?? process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      <BrandStyle brand={brand} />
      {gtm && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');window.dataLayer.push({brand:'${brand.slug}'});`,
          }}
        />
      )}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a)return;var h=a.getAttribute('href')||'';var intent=a.dataset.intent||(/^tel:/.test(h)?'phone':/^sms:/.test(h)?'text':/maps\.(google|apple)|google\.com\/maps/.test(h)?'directions':'');if(!intent&&!/^https?:/.test(h))return;window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'brand_conversion_click',brand:'${brand.slug}',link_intent:intent||'outbound',link_url:a.href,link_text:(a.textContent||'').trim().slice(0,100)});});`,
        }}
      />
      <div className="brand-site min-h-screen" data-brand={brand.slug}>
        <BrandEntityJsonLd brand={brand} description={content.seo.description} image={content.seo.ogImage} />
        <AlertBar alert={alert} />
        <Header brand={brand} />
        <main>{children}</main>
        <MembershipBand brand={brand} />
        <Footer brand={brand} blurb={content.footerBlurb} />
      </div>
    </>
  );
}
