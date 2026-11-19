import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/panel");

  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/panel";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_#fff7ed_0%,_#f4f4f5_45%,_#e4e4e7_100%)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
            Stoat
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            Admin
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Sign in with Authentik to manage this instance.
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signIn("authentik", { redirectTo: callbackUrl });
          }}
          className="rounded-xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur"
        >
          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Continue with Authentik
          </button>
        </form>
      </div>
    </main>
  );
}
