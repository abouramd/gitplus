import { getLeaderboard, hasVoted } from "@/lib/kv";
import { ProjectCard } from "@/components/project-card";
import { auth } from "@/auth";

export async function Leaderboard() {
  const [projects, session] = await Promise.all([getLeaderboard(), auth()]);

  const userId = session?.user?.id ?? null;
  const isSignedIn = !!userId;

  // Check vote status for each project if signed in
  const voteStatuses = await Promise.all(
    projects.map((p) =>
      userId ? hasVoted(userId, p.id) : Promise.resolve(false)
    )
  );

  if (projects.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        <p className="text-xl font-medium">No projects yet.</p>
        <p className="mt-1 text-sm">Be the first to submit one!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          rank={index + 1}
          hasVoted={voteStatuses[index] ?? false}
          isSignedIn={isSignedIn}
        />
      ))}
    </div>
  );
}
