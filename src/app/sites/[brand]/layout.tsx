import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { BRAND_SLUGS, isBrandSlug } from "@/config/brands";
import { getAlert, getBrand, getContent } from "@/lib/content";
import { BrandStyle } from "@/components/BrandProvider";
import { AlertBar, Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LocalBusinessJsonLd } from "@/components/Sections";

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
  return {
    metadataBase: new URL(`https://${brand.canonicalDomain}`),
    title: { default: c.seo.title, template: `%s | ${brand.nap.displayName}` },
    description: c.seo.description,
    alternates: { canonical: "/" },
    openGraph: { title: c.seo.title, description: c.seo.description, images: [c.seo.ogImage], siteName: brand.nap.displayName, type: "website" },
    icons: { icon: brand.logo.src },
    robots: { index: true, follow: true },
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
      <LocalBusinessJsonLd brand={brand} description={content.seo.description} image={content.seo.ogImage} />
      <AlertBar alert={alert} />
      <Header brand={brand} />
      <main>{children}</main>
      <Footer brand={brand} blurb={content.footerBlurb} />
    </>
  );
}
