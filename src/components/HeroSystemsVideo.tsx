import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/sceneCapability";

/**
 * The observatory stage's motion plate.
 *
 * This replaces the procedural voxel scene with a single authored clip that
 * tells the same story — identity → distributed architecture → orchestration →
 * identity — with none of the WebGL runtime. There is no renderer, no frame
 * loop, no 3D dependency and no control surface: a native `<video>` and two
 * pieces of state.
 *
 * Three details are deliberate:
 *
 * 1. **The clip is decorative.** The hero's heading and copy carry the whole
 *    professional message, so the plate is `aria-hidden` and out of the tab
 *    order. It has no accessible name because it makes no claim of its own.
 *
 * 2. **The poster is frame 0 of the clip.** Nothing bright ever paints: the
 *    stage renders its matched dark ground, the poster lands on it, and the
 *    first decoded frame replaces an identical image. No opacity gate is
 *    needed, which keeps the hero's "content is never opacity-gated" rule
 *    intact for the one element that could have broken it.
 *
 * 3. **Reduced motion downloads nothing.** `preload="none"` with no autoplay
 *    leaves the poster — the LA identity state — as the finished picture, so
 *    the stage is never blank and never spends 2.7 MB on motion the visitor
 *    asked not to see.
 */

const VIDEO_SRC = "/media/hero-systems-loop.mp4";
const POSTER_SRC = "/media/hero-systems-loop-poster.jpg";

/**
 * The clip returns to its identity state but not to its exact first frame:
 * measured against the source, the cut is 8–14× a normal frame-to-frame delta,
 * because the ambient dust that has accumulated by 10s vanishes at 0s.
 *
 * So the last stretch dissolves into the ground the plate is already painted
 * with, and fades back up after the wrap. That is the entire mitigation — no
 * second decode, no canvas, no playback state machine. `timeupdate` fires
 * about four times a second, and the lead is wide enough that the fade always
 * finishes before the cut even on the coarsest tick.
 */
const SEAM_LEAD_S = 0.62;

const HeroSystemsVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mounted = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [atSeam, setAtSeam] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);

    setReducedMotion(query.matches);
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Belt and braces against ever making a sound: React sets `muted` as a
    // property, but `defaultMuted` is what survives a re-mount or a source
    // swap, and both are cheaper than trusting either one alone.
    video.muted = true;
    video.defaultMuted = true;

    const firstRun = !mounted.current;
    mounted.current = true;

    if (reducedMotion) {
      if (!video.paused) video.pause();
      // Back to the frame the poster shows, so the two are interchangeable.
      if (video.currentTime > 0) video.currentTime = 0;
      setAtSeam(false);
      return;
    }

    // The first play belongs to the `autoPlay` attribute — calling it here as
    // well would only race it. This branch exists for the visitor who turns
    // reduced motion back off mid-session. `play()` predates promises, so the
    // return value is checked before it is caught; a rejection means the
    // browser declined autoplay, which leaves the poster — a valid end state.
    if (firstRun) return;
    const started = video.play();
    if (started && typeof started.catch === "function") {
      started.catch(() => undefined);
    }
  }, [reducedMotion]);

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video?.duration || !Number.isFinite(video.duration)) return;
    setAtSeam(video.duration - video.currentTime <= SEAM_LEAD_S);
  };

  return (
    <div className="hero-video-plane" aria-hidden="true">
      <video
        ref={videoRef}
        className="hero-video"
        data-seam={atSeam ? "true" : "false"}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload={reducedMotion ? "none" : "metadata"}
        tabIndex={-1}
        disablePictureInPicture
        onTimeUpdate={onTimeUpdate}
      />
    </div>
  );
};

export default HeroSystemsVideo;
