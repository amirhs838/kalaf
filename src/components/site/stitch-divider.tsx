"use client";

/** dashed "stitch line" divider — replaces plain <hr> everywhere */
export function StitchDivider({
  className = "",
  withButton = false,
  vertical = false,
}: {
  className?: string;
  withButton?: boolean;
  vertical?: boolean;
}) {
  if (vertical) {
    return <div className={`stitch-line-v ${className}`} aria-hidden />;
  }
  if (withButton) {
    return (
      <div className={`relative flex items-center justify-center my-2 ${className}`} aria-hidden>
        <div className="stitch-line flex-1" />
        <span
          className="mx-3 inline-block w-2.5 h-2.5 rounded-full bg-clay/80 shrink-0"
          style={{ boxShadow: "0 0 0 3px var(--canvas)" }}
        />
        <div className="stitch-line flex-1" />
      </div>
    );
  }
  return <div className={`stitch-line ${className}`} aria-hidden />;
}
