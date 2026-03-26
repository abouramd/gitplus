import { kv } from "@vercel/kv";
import type { Project, ProjectWithId } from "@/types";

export async function getLeaderboard(): Promise<ProjectWithId[]> {
  // zrange with REV option returns members sorted by score descending
  const ids = await kv.zrange("project:index", 0, -1, { rev: true });
  if (!ids || ids.length === 0) return [];

  const projects = await Promise.all(
    (ids as string[]).map(async (id) => {
      const project = await kv.get<Project>(`project:${id}`);
      if (!project) return null;
      return { ...project, id };
    })
  );

  return projects.filter((p): p is ProjectWithId => p !== null);
}

export async function getProject(id: string): Promise<ProjectWithId | null> {
  const project = await kv.get<Project>(`project:${id}`);
  if (!project) return null;
  return { ...project, id };
}

export async function hasVoted(
  userId: string,
  projectId: string
): Promise<boolean> {
  const vote = await kv.get(`vote:${userId}:${projectId}`);
  return vote === "1";
}

export async function castVote(
  userId: string,
  projectId: string
): Promise<{ success: boolean; newCount: number }> {
  const alreadyVoted = await hasVoted(userId, projectId);
  if (alreadyVoted) {
    const project = await kv.get<Project>(`project:${projectId}`);
    return { success: false, newCount: project?.upvotes ?? 0 };
  }

  // Set vote record
  await kv.set(`vote:${userId}:${projectId}`, "1");

  // Increment upvote count in project object
  const project = await kv.get<Project>(`project:${projectId}`);
  if (!project) return { success: false, newCount: 0 };

  const newCount = project.upvotes + 1;
  await kv.set(`project:${projectId}`, { ...project, upvotes: newCount });

  // Update sorted set score
  await kv.zadd("project:index", { score: newCount, member: projectId });

  return { success: true, newCount };
}

export async function getUpvoteCount(projectId: string): Promise<number> {
  const project = await kv.get<Project>(`project:${projectId}`);
  return project?.upvotes ?? 0;
}
