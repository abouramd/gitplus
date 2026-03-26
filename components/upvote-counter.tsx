"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

interface UpvoteCounterProps {
  projectId: string;
  initialCount: number;
  initialHasVoted: boolean;
  isSignedIn: boolean;
}

export function UpvoteCounter({
  projectId,
  initialCount,
  initialHasVoted,
  isSignedIn,
}: UpvoteCounterProps) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialHasVoted);
  const [isLoading, setIsLoading] = useState(false);

  // Poll every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/upvote/${projectId}`);
        if (res.ok) {
          const data = (await res.json()) as { count: number };
          setCount(data.count);
        }
      } catch {
        // Silently ignore polling errors
      }
    }, 10_000);

    return () => clearInterval(interval);
  }, [projectId]);

  async function handleUpvote() {
    if (!isSignedIn || voted || isLoading) return;

    setCount((c) => c + 1);
    setVoted(true);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/upvote/${projectId}`, {
        method: "POST",
      });

      if (!res.ok) {
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
      size="lg"
      onClick={handleUpvote}
      disabled={!isSignedIn || voted || isLoading}
      className={
        voted
          ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
          : ""
      }
      title={
        !isSignedIn
          ? "Sign in to upvote"
          : voted
          ? "Already voted"
          : "Upvote this project"
      }
    >
      <ChevronUp className="h-5 w-5 mr-2" />
      {count} {count === 1 ? "upvote" : "upvotes"}
    </Button>
  );
}
