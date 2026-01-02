"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./HeroVideo.module.css";

export interface HeroVideoProps {
  youtubeUrl: string;
  posterSrc?: string;
  loopStart?: number;
  loopEnd?: number;
}

function extractYouTubeID(url: string | undefined | null): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];

  for (const p of patterns) {
    const m = url.match(p);
    if (m && m[1]) return m[1];
  }

  const m = url.match(/([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function HeroVideo({
  youtubeUrl,
  posterSrc = "/ethiopian-building.jpg",
  loopStart = 12,
  loopEnd = 22,
}: HeroVideoProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Avoid loading the iframe on small screens: rely on poster only
    if (typeof window !== "undefined" && window.innerWidth <= 800) {
      return;
    }

    const videoId = extractYouTubeID(youtubeUrl);
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (!videoId) {
      console.warn("HeroVideo: invalid YouTube URL or ID. Falling back to poster only.");
      return;
    }

    const injectIframe = () => {
      if (!wrap || wrap.querySelector("iframe")) return;

      const params = new URLSearchParams({
        autoplay: "1",
        mute: "1",
        controls: "0",
        rel: "0",
        loop: "1",
        playlist: videoId,
        modestbranding: "1",
        playsinline: "1",
      });

      if (Number.isFinite(loopStart) && (loopStart ?? 0) > 0) {
        params.set("start", String(loopStart));
      }
      if (Number.isFinite(loopEnd) && (loopEnd ?? 0) > 0) {
        params.set("end", String(loopEnd));
      }

      const src = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;

      const iframe = document.createElement("iframe");
      iframe.className = styles.iframe;
      iframe.src = src;
      iframe.title = "Background video";
      iframe.frameBorder = "0";
      iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.pointerEvents = "none";

      iframe.onerror = () => {
        console.warn("HeroVideo: iframe failed to load; keeping poster visible.");
      };

      wrap.appendChild(iframe);
    };

    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              injectIframe();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );

      obs.observe(wrap);
      return () => obs.disconnect();
    } else {
      const t = window.setTimeout(injectIframe, 1000);
      return () => window.clearTimeout(t);
    }
  }, [isClient, youtubeUrl, loopStart, loopEnd]);

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.videoWrap} ref={wrapRef} />
      <div className={styles.poster}>
        <div className={styles.posterInner}>
          <Image src={posterSrc} alt="" fill style={{ objectFit: "cover" }} priority={false} />
        </div>
      </div>
    </div>
  );
}
