import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="navbar-ctp sticky top-0 z-50 w-full">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg tracking-tight"
        >
          <span className="text-ctp-mauve">Git</span>
          <span className="text-ctp-text">Pulse</span>
        </Link>

        <nav className="flex items-center gap-3">
          <ThemeToggle />
          {session?.user ? (
            <>
              <Link href="/submit">
                <Button size="sm" variant="outline">
                  Submit Project
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session.user.image ?? undefined}
                    alt={session.user.name ?? "User"}
                  />
                  <AvatarFallback>
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-ctp-subtext1 sm:inline">
                  {session.user.name}
                </span>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button size="sm" variant="ghost" type="submit">
                    Sign out
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <Button size="sm" type="submit">
                Sign in with GitHub
              </Button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
