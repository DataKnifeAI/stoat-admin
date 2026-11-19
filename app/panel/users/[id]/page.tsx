import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyId } from "@/components/CopyId";
import { UserDetail } from "@/components/details/UserDetail";
import { fmtUser } from "@/lib/format";
import { getUser } from "@/lib/stoat";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, account, memberOf } = await getUser(id);
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/panel/users" className="text-sm text-stoat-muted hover:underline">
          ← Users
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-stoat-text">
          {fmtUser(user)}
        </h1>
        <div className="mt-1">
          <CopyId id={user._id} className="-ml-1.5" />
        </div>
      </div>

      <UserDetail user={user} account={account} memberOf={memberOf} />
    </div>
  );
}
