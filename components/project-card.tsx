import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UpvoteButton } from "@/components/upvote-button";
import { GitBranch } from "lucide-react";
import type { ProjectWithId } from "@/types";

interface ProjectCardProps {
  project: ProjectWithId;
  rank: number;
  hasVoted: boolean;
  isSignedIn: boolean;
}

export function ProjectCard({
  project,
  rank,
  hasVoted,
  isSignedIn,
}: ProjectCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden border-ctp-surface1 bg-ctp-surface0 shadow-[var(--shadow-sm)] transition-[border-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-ctp-surface2 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5">
      <Link href={`/project/${project.id}`} className="block">
        <div className="relative h-40 w-full bg-ctp-surface0">
          <Image
            src={project.imageUrl}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Badge
            variant="secondary"
            className="absolute left-2 top-2 font-bold bg-ctp-surface1/80 text-ctp-text backdrop-blur-sm"
          >
            #{rank}
          </Badge>
        </div>
      </Link>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/project/${project.id}`}
            className="font-semibold text-ctp-text hover:text-ctp-mauve line-clamp-1 transition-colors duration-[var(--duration-base)]"
          >
            {project.name}
          </Link>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="shrink-0 text-ctp-overlay1 hover:text-ctp-mauve transition-colors duration-[var(--duration-base)]"
          >
            <GitBranch className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <p className="text-sm text-ctp-subtext1 line-clamp-2">
          {project.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5">
          <Avatar className="h-5 w-5">
            <AvatarImage
              src={project.submitterAvatar}
              alt={project.submitterName}
            />
            <AvatarFallback className="text-xs">
              {project.submitterName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-ctp-overlay1 truncate max-w-[100px]">
            {project.submitterName}
          </span>
        </div>

        <UpvoteButton
          projectId={project.id}
          initialCount={project.upvotes}
          hasVoted={hasVoted}
          isSignedIn={isSignedIn}
        />
      </CardFooter>
    </Card>
  );
}
