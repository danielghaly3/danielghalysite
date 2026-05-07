import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6 text-ink">
      <div className="max-w-md text-center">
        <h1 className="font-display text-5xl font-semibold tracking-[-0.02em]">
          Case study coming soon.
        </h1>
        <p className="mt-5 text-ash">
          Full case studies are intentionally light for v1. Daniel will add more after launch.
        </p>
        <Link className="text-link mt-8" href="/#work">
          Back to selected work
        </Link>
      </div>
    </main>
  );
}
