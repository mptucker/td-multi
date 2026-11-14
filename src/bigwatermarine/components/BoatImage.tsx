"use client";

import Image, { type ImageProps } from "next/image";

// Listing photos come from Boats Group; route them through /api/bwm/img/ for
// right-sized WebP. Local images fall back to Next's normal optimizer.
const remoteLoader: ImageProps["loader"] = ({ src, width, quality }) =>
  `/api/bwm/img?u=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 72}`;

export default function BoatImage(props: ImageProps) {
  const remote = typeof props.src === "string" && props.src.startsWith("https://");
  return <Image {...props} alt={props.alt} loader={remote ? remoteLoader : undefined} />;
}
