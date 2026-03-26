import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { castVote, getUpvoteCount } from "@/lib/kv";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const count = await getUpvoteCount(id);
  return NextResponse.json({ count });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await castVote(session.user.id, id);

  if (!result.success) {
    return NextResponse.json(
      { error: "Already voted", count: result.newCount },
      { status: 409 }
    );
  }

  return NextResponse.json({ count: result.newCount });
}
