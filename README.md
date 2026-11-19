# Stoat Admin

![Stoat Admin](./public/admin-hero.jpg)

Self-hosted admin panel for a [Stoat](https://stoat.chat) / Revolt instance.

Built for the [stoat-operator](https://github.com/DataKnifeAI/stoat-operator): Authentik SSO, dedicated Ingress, and direct MongoDB access to the `revolt` database.

## Features

- Authentik OIDC login (Auth.js / NextAuth)
- Dashboard with live collection counts
- Users + accounts browse / search
- Servers browse / search
- Inspect-by-ULID across users, servers, channels, messages, bots

## Quick start (local)

```bash
cp .env.example .env.local
# fill AUTHENTIK_* , NEXTAUTH_* , MONGODB
npm install
npm run dev
```

Open http://localhost:3000 — unauthenticated visitors are sent to `/login`.

## Container

```bash
docker build -t harbor.dataknife.net/library/stoat-admin-panel:latest .
docker push harbor.dataknife.net/library/stoat-admin-panel:latest
```

Runtime env matches what the operator writes into `stoat-admin-env`:

| Variable | Purpose |
|----------|---------|
| `NEXTAUTH_URL` | Public https URL of the panel |
| `NEXTAUTH_SECRET` | Session encryption secret |
| `AUTHENTIK_ID` / `AUTHENTIK_SECRET` / `AUTHENTIK_ISSUER` | OIDC app (issuer **without** trailing `/`) |
| `MONGODB` | Mongo connection string |
| `MONGODB_DB` | Database name (default `revolt`) |
| `PLATFORM_ACCOUNT_ID` | Reserved for future platform actions |
| `HOST` / `PORT` | Bind address (default `0.0.0.0:3000`) |

Authentik redirect URI:

```text
https://<admin.domain>/api/auth/callback/authentik
```

## Operator

See the stoat-operator README `Admin panel` section. Point `spec.images.adminPanel` (or the default Harbor tag) at an image built from this repo.

## License

AGPL-3.0-or-later (aligned with Stoat server components).
