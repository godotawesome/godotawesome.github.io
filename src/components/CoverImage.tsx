/**
 * Card cover that never crops the picture.
 * The frame uses the 1200x630 thumbnail ratio. Images with another ratio
 * (square, 16:9, Steam headers) are shown whole over a blurred copy of themselves.
 */
export function CoverImage({
  src,
  alt,
  lazy = true,
}: {
  src: string;
  alt: string;
  lazy?: boolean;
}) {
  return (
    <span className="relative block aspect-[1200/630] w-full overflow-hidden bg-black/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl"
        loading={lazy ? "lazy" : undefined}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="relative h-full w-full object-contain transition duration-300 hover:scale-[1.02]"
        loading={lazy ? "lazy" : undefined}
      />
    </span>
  );
}
