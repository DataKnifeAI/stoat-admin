import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/panel");

  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/panel";
  const error = params.error;

  return (
    <main className="login-shell relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="login-orb login-orb-a" aria-hidden />
      <div className="login-orb login-orb-b" aria-hidden />

      <div className="login-panel relative z-10 w-full max-w-md">
        <div className="login-brand mb-8 text-center">
          <div className="login-mark mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-lg font-semibold tracking-tight text-orange-400 shadow-lg shadow-orange-900/10">
            S
          </div>
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
          className="login-card rounded-xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur"
        >
          {error ? (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              Sign-in failed ({error}). Check Authentik issuer / client config.
            </p>
          ) : null}
          <button
            type="submit"
            className="login-cta w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Continue with Authentik
          </button>
        </form>
      </div>
    </main>
  );
}
