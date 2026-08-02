import { SITE } from "@/lib/site";

/** Hardcoded sticky AADS unit (bottom bar, dismissible). */
const STICKY_UNIT_ID = "2450392";
const CLOSE_ID = "aadsstickymsc6vwey";

/**
 * AADS sticky bottom banner. Not consent-gated.
 * z-index stays below CookieConsent (z-50) so the banner is never covered.
 */
export function AadsSticky() {
  if (!SITE.aadsEnabled) return null;

  return (
    <aside aria-label="Advertisement" className="aads-sticky">
      {/* BEGIN AADS AD UNIT 2450392 */}
      <input autoComplete="off" type="checkbox" id={CLOSE_ID} hidden />
      <div className="aads-sticky-panel">
        <div className="aads-sticky-bar">
          <label htmlFor={CLOSE_ID} className="aads-sticky-close" aria-label="Close advertisement">
            <svg
              fill="#000000"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 490 490"
              aria-hidden="true"
            >
              <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337" />
            </svg>
          </label>
          <div className="aads-sticky-frame">
            <iframe
              data-aa={STICKY_UNIT_ID}
              src={`https://acceptable.a-ads.com/${STICKY_UNIT_ID}/?size=Adaptive`}
              title="Advertisement"
              style={{
                border: 0,
                padding: 0,
                width: "70%",
                height: "auto",
                overflow: "hidden",
                margin: "auto",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>
      <style>{`
        .aads-sticky {
          position: absolute;
          z-index: 40;
        }
        .aads-sticky-bar {
          width: 100%;
          height: auto;
          position: fixed;
          text-align: center;
          font-size: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
        }
        .aads-sticky-close {
          top: 50%;
          transform: translateY(-50%);
          right: 24px;
          position: absolute;
          border-radius: 4px;
          background: rgba(248, 248, 249, 0.7);
          padding: 4px;
          z-index: 41;
          cursor: pointer;
          line-height: 0;
        }
        .aads-sticky-frame {
          width: 100%;
          margin: auto;
          position: relative;
          z-index: 40;
        }
        #${CLOSE_ID}:checked + .aads-sticky-panel {
          display: none;
        }
      `}</style>
      {/* END AADS AD UNIT 2450392 */}
    </aside>
  );
}
