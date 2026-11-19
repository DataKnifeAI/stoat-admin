import { StatCard } from "@/components/StatCard";
import { getDashboardStats } from "@/lib/stoat";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Live counts from the Stoat MongoDB (`revolt`).
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={stats.users} href="/panel/users" />
        <StatCard label="Accounts" value={stats.accounts} href="/panel/users" />
        <StatCard label="Servers" value={stats.servers} href="/panel/servers" />
        <StatCard label="Channels" value={stats.channels} />
        <StatCard label="Messages" value={stats.messages} />
        <StatCard label="Bots" value={stats.bots} />
        <StatCard label="Sessions" value={stats.sessions} />
        <StatCard label="Members" value={stats.members} />
        <StatCard label="Safety reports" value={stats.reports} />
      </section>
    </div>
  );
}
