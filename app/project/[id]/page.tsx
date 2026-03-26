import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { getProject, hasVoted } from "@/lib/kv";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UpvoteCounter } from "@/components/upvote-counter";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const [project, session] = await Promise.all([getProject(id), auth()]);

  if (!project) notFound();

  const userId = session?.user?.id ?? null;
  const voted = userId ? await hasVoted(userId, id) : false;
  const isSignedIn = !!userId;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leaderboard
      </Link>

      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-muted sm:h-80">
        <Image
          src={project.imageUrl}
          alt={project.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {project.description}
          </p>
        </div>

        <div className="shrink-0">
          <UpvoteCounter
            projectId={project.id}
            initialCount={project.upvotes}
            initialHasVoted={voted}
            isSignedIn={isSignedIn}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t pt-6">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View on GitHub
          </Button>
        </a>

        <Badge variant="secondary">
          Submitted {new Date(project.createdAt).toLocaleDateString()}
        </Badge>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <span>Submitted by</span>
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={project.submitterAvatar}
            alt={project.submitterName}
          />
          <AvatarFallback className="text-xs">
            {project.submitterName[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-foreground">
          {project.submitterName}
        </span>
      </div>
    </div>
  );
}
