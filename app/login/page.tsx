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
          <div className="login-mark mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-stoat-cyan-dark text-lg font-semibold tracking-tight text-stoat-cyan shadow-lg">
            S
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stoat-cyan">
            Stoat
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stoat-text">
            Admin
          </h1>
          <p className="mt-2 text-sm text-stoat-muted">
            Sign in with Authentik to manage this instance.
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("authentik", { redirectTo: callbackUrl });
          }}
          className="login-card rounded-xl border border-white/10 bg-stoat-panel/90 p-6 shadow-sm backdrop-blur"
        >
          {error ? (
            <p className="mb-4 rounded-md border border-red-400/40 bg-red-950/50 px-3 py-2 text-sm text-red-200">
              Sign-in failed ({error}). Check Authentik issuer / client config.
            </p>
          ) : null}
          <button
            type="submit"
            className="login-cta w-full rounded-md bg-stoat-cyan px-4 py-2.5 text-sm font-medium text-stoat-slate transition hover:brightness-110"
          >
            Continue with Authentik
          </button>
        </form>
      </div>
    </main>
  );
}
