import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SubmitForm } from "./submit-form";

export default async function SubmitPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/submit");
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Submit a Project</h1>
        <p className="mt-2 text-muted-foreground">
          Share an open-source GitHub project with the community.
        </p>
      </div>
      <SubmitForm
        user={{
          id: session.user.id ?? "",
          name: session.user.name ?? "",
          image: session.user.image ?? "",
        }}
      />
    </div>
  );
}
