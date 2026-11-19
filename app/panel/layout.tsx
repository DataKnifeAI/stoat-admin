import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { auth, signOut } from "@/lib/auth";

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userLabel =
    session.user.name || session.user.email || "Authenticated operator";

  return (
    <div className="flex min-h-screen">
      <Sidebar userLabel={userLabel} signOutAction={signOutAction} />
      <main className="min-w-0 flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
