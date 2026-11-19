import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyId } from "@/components/CopyId";
import { ServerDetail } from "@/components/details/ServerDetail";
import { getServer } from "@/lib/stoat";

export const dynamic = "force-dynamic";

export default async function ServerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { server, memberCount, owner } = await getServer(id);
  if (!server) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/panel/servers"
          className="text-sm text-stoat-muted hover:underline"
        >
          ← Servers
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-stoat-text">
          {server.name || "(unnamed)"}
        </h1>
        <div className="mt-1">
          <CopyId id={server._id} className="-ml-1.5" />
        </div>
      </div>

      <ServerDetail server={server} memberCount={memberCount} owner={owner} />
    </div>
  );
}
