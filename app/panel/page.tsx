import { AreaChart, BarChart, HeatStrip } from "@/components/charts";
import { StatCard } from "@/components/StatCard";
import { getEngagement } from "@/lib/engagement";
import { getDashboardStats } from "@/lib/stoat";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, engagement] = await Promise.all([
    getDashboardStats(),
    getEngagement(30),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-stoat-text">Dashboard</h1>
        <p className="mt-1 text-sm text-stoat-muted">
          Live counts and engagement from the Stoat MongoDB (`revolt`).
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

      <section className="grid gap-4 lg:grid-cols-2">
        <AreaChart
          label={`Messages · last ${engagement.days}d`}
          series={engagement.messagesPerDay}
          color="#00d8ff"
        />
        <AreaChart
          label={`New users · last ${engagement.days}d`}
          series={engagement.usersPerDay}
          color="#00ffd8"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BarChart
          label="Top servers by recent messages"
          items={engagement.topServers.map((s) => ({
            name: s.name,
            count: s.count,
          }))}
          color="#00ffd8"
        />
        <HeatStrip
          label="Busiest hours (UTC) · recent messages"
          hours={engagement.busyHours}
        />
      </section>
    </div>
  );
}
