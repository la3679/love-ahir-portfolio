import type { CaseMedia } from "@/data/caseStudies";

interface MediaFrameProps {
  media: CaseMedia;
  className?: string;
  /** Set on above-the-fold media; everything else lazy-loads. */
  eager?: boolean;
}

/**
 * Bordered screenshot/recording frame with an optional caption.
 * Videos render muted + inline; images lazy-load with reserved space.
 */
const MediaFrame = ({ media, className = "", eager = false }: MediaFrameProps) => {
  const isVideo = /\.(mp4|webm)$/i.test(media.src);

  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-md border border-border bg-secondary">
        {isVideo ? (
          <video
            src={media.src}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
            aria-label={media.alt}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <img
            src={media.src}
            alt={media.alt}
            loading={eager ? "eager" : "lazy"}
            className="aspect-video w-full object-cover"
          />
        )}
      </div>
      {media.caption && (
        <figcaption className="meta-line mt-2">{media.caption}</figcaption>
      )}
    </figure>
  );
};

export default MediaFrame;
