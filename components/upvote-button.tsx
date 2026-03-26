"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

interface UpvoteButtonProps {
  projectId: string;
  initialCount: number;
  hasVoted: boolean;
  isSignedIn: boolean;
}

export function UpvoteButton({
  projectId,
  initialCount,
  hasVoted: initialHasVoted,
  isSignedIn,
}: UpvoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialHasVoted);
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpvote() {
    if (!isSignedIn || voted || isLoading) return;

    // Optimistic update
    setCount((c) => c + 1);
    setVoted(true);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/upvote/${projectId}`, {
        method: "POST",
      });

      if (!res.ok) {
        // Revert on failure
        setCount((c) => c - 1);
        setVoted(false);
      } else {
        const data = (await res.json()) as { count: number };
        setCount(data.count);
      }
    } catch {
      setCount((c) => c - 1);
      setVoted(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant={voted ? "default" : "outline"}
      size="sm"
      onClick={handleUpvote}
      disabled={!isSignedIn || voted || isLoading}
      className={
        voted
          ? "bg-ctp-mauve hover:bg-ctp-lavender text-ctp-base border-ctp-mauve shadow-[var(--shadow-glow-mauve)]"
          : "border-ctp-surface1 text-ctp-subtext1 hover:border-ctp-mauve hover:text-ctp-mauve"
      }
      title={
        !isSignedIn
          ? "Sign in to upvote"
          : voted
          ? "Already voted"
          : "Upvote"
      }
    >
      <ChevronUp className="h-4 w-4 mr-1" />
      {count}
    </Button>
  );
}
