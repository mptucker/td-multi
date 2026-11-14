import BrandPage, { brandMetadata } from "../_components/BrandPage";

export const revalidate = 300;
export const metadata = brandMetadata("highfield");

export default function Page() {
  return <BrandPage brand="highfield" />;
}
