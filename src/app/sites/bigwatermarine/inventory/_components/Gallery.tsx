"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BoatImage from "@/bigwatermarine/components/BoatImage";

// Main photo with arrows and a counter, a thumbnail strip, keyboard support,
// and a full-screen view. Every photo is a real <img> link target for search.
export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [i, setI] = useState(0);
  const [full, setFull] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const n = images.length;
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    const el = thumbs.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [i]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (full && !d.open) d.showModal();
    if (!full && d.open) d.close();
  }, [full]);

  if (!n) return <div className="bwm-gallery bwm-gallery--empty">Photos coming soon</div>;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <div className="bwm-gallery" onKeyDown={onKey}>
      <div className="bwm-galleryMain">
        <button type="button" className="bwm-galleryOpen" onClick={() => setFull(true)} aria-label={`View photo ${i + 1} of ${n} full screen`}>
          <BoatImage src={images[i]} alt={`${title}, photo ${i + 1} of ${n}`} fill sizes="(min-width: 1100px) 62vw, 100vw" loading="eager" fetchPriority="high" className="bwm-galleryImg" />
        </button>
        {n > 1 && (
          <>
            <button type="button" className="bwm-galleryNav bwm-galleryNav--prev" onClick={() => go(-1)} aria-label="Previous photo">‹</button>
            <button type="button" className="bwm-galleryNav bwm-galleryNav--next" onClick={() => go(1)} aria-label="Next photo">›</button>
          </>
        )}
        <span className="bwm-galleryCount" aria-live="polite">{i + 1} / {n}</span>
      </div>

      {n > 1 && (
        <div className="bwm-galleryThumbs" ref={thumbs} role="list" aria-label="All photos">
          {images.map((src, k) => (
            <button key={src} type="button" role="listitem" className="bwm-thumb" aria-current={k === i} aria-label={`Show photo ${k + 1}`} onClick={() => setI(k)}>
              <BoatImage src={src} alt="" fill sizes="120px" className="bwm-thumbImg" />
            </button>
          ))}
        </div>
      )}

      <dialog ref={dialog} className="bwm-lightbox" onClose={() => setFull(false)} onKeyDown={onKey} aria-label={`${title} photos`}>
        {full && (
          <div className="bwm-lightboxInner">
            <BoatImage src={images[i]} alt={`${title}, photo ${i + 1} of ${n}`} fill sizes="100vw" className="bwm-lightboxImg" />
            <button type="button" className="bwm-galleryNav bwm-galleryNav--prev" onClick={() => go(-1)} aria-label="Previous photo">‹</button>
            <button type="button" className="bwm-galleryNav bwm-galleryNav--next" onClick={() => go(1)} aria-label="Next photo">›</button>
            <span className="bwm-galleryCount">{i + 1} / {n}</span>
            <button type="button" className="bwm-lightboxClose" onClick={() => setFull(false)}>Close</button>
          </div>
        )}
      </dialog>
    </div>
  );
}
