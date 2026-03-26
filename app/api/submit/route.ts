import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { z } from "zod";
import { auth } from "@/auth";
import type { Project } from "@/types";

const submitSchema = z.object({
  name: z.string().min(1).max(100),
  githubUrl: z
    .string()
    .url()
    .regex(/^https:\/\/github\.com\/.+/, "Must be a GitHub URL"),
  description: z.string().min(1).max(200),
  submitterId: z.string().min(1),
  submitterName: z.string().min(1),
  submitterAvatar: z.string(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();

  const parsed = submitSchema.safeParse({
    name: formData.get("name"),
    githubUrl: formData.get("githubUrl"),
    description: formData.get("description"),
    submitterId: formData.get("submitterId"),
    submitterName: formData.get("submitterName"),
    submitterAvatar: formData.get("submitterAvatar"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  // Ensure submitterId matches session user
  if (parsed.data.submitterId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const imageFile = formData.get("image");
  if (!(imageFile instanceof File)) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  if (imageFile.size > 2 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Image must be under 2 MB" },
      { status: 400 }
    );
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(imageFile.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, or WebP images are allowed" },
      { status: 400 }
    );
  }

  // Upload to Vercel Blob
  const blob = await put(imageFile.name, imageFile, {
    access: "public",
    contentType: imageFile.type,
  });

  const id = nanoid();
  const project: Project = {
    id,
    name: parsed.data.name,
    githubUrl: parsed.data.githubUrl,
    description: parsed.data.description,
    imageUrl: blob.url,
    submitterId: parsed.data.submitterId,
    submitterName: parsed.data.submitterName,
    submitterAvatar: parsed.data.submitterAvatar,
    upvotes: 0,
    createdAt: new Date().toISOString(),
  };

  // Write project to KV
  await kv.set(`project:${id}`, project);

  // Add to sorted set with score 0
  await kv.zadd("project:index", { score: 0, member: id });

  return NextResponse.json({ id }, { status: 201 });
}
