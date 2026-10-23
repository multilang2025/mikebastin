"use client";

import { useEffect, useState } from "react";
import { CONSENT_CHANGE, hasConsent, openConsent } from "@/lib/consent";

const VIDEO_ID = "MLKgbeDeCxU";

export default function RelatedVideo() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(hasConsent("media"));
    sync();
    window.addEventListener(CONSENT_CHANGE, sync);
    return () => window.removeEventListener(CONSENT_CHANGE, sync);
  }, []);

  return (
    <figure className="post-video">
      <div className="post-video-frame">
        {allowed ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
            title="What is Answer Engine Optimization? — Ahrefs"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="post-video-consent">
            <span aria-hidden="true">▶</span>
            <strong>Watch: What is Answer Engine Optimization?</strong>
            <p>This seven-minute Ahrefs lesson explains how pages earn citations in AI answers.</p>
            <button type="button" onClick={openConsent}>Allow embedded media</button>
            <a href={`https://www.youtube.com/watch?v=${VIDEO_ID}`} target="_blank" rel="noopener noreferrer">
              Watch on YouTube
            </a>
          </div>
        )}
      </div>
      <figcaption>Ahrefs, “What is AEO?” (7 minutes). A practical introduction to visibility and citations in AI Overviews, ChatGPT and other answer engines.</figcaption>
    </figure>
  );
}
