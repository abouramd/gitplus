"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-24 text-center">
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8">
        <p className="font-medium text-destructive">
          Something went wrong loading the page.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          This may be a temporary issue with the database.
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-[var(--duration-base)] hover:bg-primary/80 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
