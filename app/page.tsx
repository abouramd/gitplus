import { Suspense } from "react";
import { Leaderboard } from "@/components/leaderboard";
import { ProjectCardSkeleton } from "@/components/project-card-skeleton";

function LeaderboardSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-ctp-mauve">Git</span>
          <span className="text-ctp-text">Pulse</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          The open-source project leaderboard. Discover and upvote the best
          GitHub repos.
        </p>
      </div>

      <Suspense fallback={<LeaderboardSkeleton />}>
        <Leaderboard />
      </Suspense>
    </div>
  );
}
