import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-container py-20 text-center">
      <h1 className="mb-4 font-sans text-4xl font-bold">
        <span className="rounded bg-red-600 px-3 py-1 text-white">404</span> Page does not
        exist!
      </h1>
      <p className="text-black/60">
        Please use the search bar at the top or visit our{" "}
        <Link href="/" className="underline">
          homepage
        </Link>
        !
      </p>
    </div>
  );
}
