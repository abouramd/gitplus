"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SubmitFormProps {
  user: {
    id: string;
    name: string;
    image: string;
  };
}

export function SubmitForm({ user }: SubmitFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2 MB.");
      e.target.value = "";
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG, or WebP images are allowed.");
      e.target.value = "";
      return;
    }
    setError(null);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("submitterId", user.id);
    formData.set("submitterName", user.name);
    formData.set("submitterAvatar", user.image);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { error?: string; id?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Project Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              name="name"
              placeholder="My Awesome Project"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="githubUrl" className="text-sm font-medium">
              GitHub URL <span className="text-destructive">*</span>
            </label>
            <Input
              id="githubUrl"
              name="githubUrl"
              type="url"
              placeholder="https://github.com/user/repo"
              required
              pattern="https://github\.com/.+"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-sm font-medium">
              One-line Description <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="A brief description of what your project does"
              required
              maxLength={200}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="image" className="text-sm font-medium">
              Hero Image <span className="text-destructive">*</span>
            </label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              ref={fileRef}
              onChange={handleImageChange}
            />
            <p className="text-xs text-muted-foreground">
              Max 2 MB. JPG, PNG, or WebP only.
            </p>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-40 w-full rounded-md object-cover"
              />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting…" : "Submit Project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
