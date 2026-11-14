import Image, { type ImageProps } from "next/image";
import manifest from "@/bigwatermarine/media-manifest.json";

export type CmsPhoto = { src: string; alt: string };

type Props = Omit<ImageProps, "src" | "alt" | "placeholder" | "blurDataURL" | "width" | "height"> & {
  image: CmsPhoto;
  /** Override the description from the content file (e.g. "" for decorative use). */
  alt?: string;
};

const MEDIA = manifest as Record<string, { width: number; height: number; blurDataURL: string }>;

/**
 * A photo chosen in /admin: a site path (/bigwatermarine/media/…) or an uploaded
 * Media library URL. Local photos keep their size and blur-up preview.
 */
export default function CmsImage({ image, alt, fill, ...rest }: Props) {
  const known = MEDIA[image.src];
  const blur = known ? { placeholder: "blur" as const, blurDataURL: known.blurDataURL } : {};
  if (fill) return <Image src={image.src} alt={alt ?? image.alt} fill {...blur} {...rest} />;
  const size = known ?? { width: 1600, height: 1000 };
  return <Image src={image.src} alt={alt ?? image.alt} width={size.width} height={size.height} {...blur} {...rest} />;
}
