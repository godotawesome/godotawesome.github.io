import { SITE } from "@/lib/site";

type Props = {
  className?: string;
};

/**
 * AADS (Acceptable Ads) in-flow banner.
 * Not gated by advertising consent: contextual / privacy-oriented network.
 * Sticky bottom unit lives in AadsSticky.tsx (separate ad unit id).
 */
export function Aads({ className = "" }: Props) {
  if (!SITE.aadsEnabled || !SITE.aadsUnitId) return null;

  const unitId = SITE.aadsUnitId;

  return (
    <aside
      className={`aads-unit my-6 w-full ${className}`}
      aria-label="Advertisement"
    >
      {/* BEGIN AADS AD UNIT — keep data-aa for AADS bot detection */}
      <div className="relative mx-auto w-full" style={{ zIndex: 1 }}>
        <iframe
          data-aa={unitId}
          src={`https://acceptable.a-ads.com/${unitId}/?size=Adaptive`}
          style={{
            border: 0,
            padding: 0,
            width: "100%",
            maxWidth: "728px",
            height: "auto",
            minHeight: "90px",
            overflow: "hidden",
            display: "block",
            margin: "auto",
          }}
          title="Advertisement"
          loading="lazy"
        />
      </div>
      {/* END AADS AD UNIT */}
    </aside>
  );
}
