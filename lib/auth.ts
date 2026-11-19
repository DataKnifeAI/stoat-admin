import NextAuth from "next-auth";

/**
 * Authentik OIDC via Auth.js. Provider id "authentik" keeps the callback path
 * compatible with the operator docs / existing Authentik redirect URI:
 *   https://<admin.domain>/api/auth/callback/authentik
 *
 * Env (operator stoat-admin-env):
 *   AUTHENTIK_ID, AUTHENTIK_SECRET, AUTHENTIK_ISSUER
 *   NEXTAUTH_URL, NEXTAUTH_SECRET
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      id: "authentik",
      name: "Authentik",
      type: "oidc",
      issuer: process.env.AUTHENTIK_ISSUER?.replace(/\/+$/, ""),
      clientId: process.env.AUTHENTIK_ID,
      clientSecret: process.env.AUTHENTIK_SECRET,
      style: { brandColor: "#fd4b2d" },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth: session }) {
      return !!session?.user;
    },
    jwt({ token, profile }) {
      if (profile) {
        token.email = profile.email ?? token.email;
        token.name = profile.name ?? token.name;
        // Prefer preferred_username from Authentik when present.
        const p = profile as Record<string, unknown>;
        if (typeof p.preferred_username === "string") {
          token.name = p.preferred_username;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        if (typeof token.email === "string") session.user.email = token.email;
        if (typeof token.name === "string") session.user.name = token.name;
      }
      return session;
    },
  },
});
