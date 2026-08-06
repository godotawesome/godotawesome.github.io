/**
 * DORMANT AADS in-flow unit. Not mounted while ads are off.
 * Before re-using: update privacy + cookie policies, then restore SITE.aads* in site.ts.
 */

type Props = {
  className?: string;
};

export function Aads(_props: Props) {
  return null;
}

/*
 * Previous implementation used acceptable.a-ads.com iframe with data-aa={unitId}
 * from SITE.aadsUnitId when SITE.aadsEnabled was true.
 */
