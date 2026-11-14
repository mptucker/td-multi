import BrandPage, { brandMetadata } from "../_components/BrandPage";

export const revalidate = 300;
export const metadata = brandMetadata("veranda");

export default function Page() {
  return <BrandPage brand="veranda" />;
}
