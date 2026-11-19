"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/panel", label: "Dashboard" },
  { href: "/panel/users", label: "Users" },
  { href: "/panel/servers", label: "Servers" },
  { href: "/panel/inspect", label: "Inspect ID" },
];

export function Sidebar({
  userLabel,
  signOutAction,
}: {
  userLabel: string;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname() || "/panel";

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50">
      <div className="border-b border-zinc-200 px-4 py-5">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
          Stoat
        </div>
        <div className="mt-1 text-lg font-semibold text-zinc-900">Admin</div>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {links.map((l) => {
          const active =
            l.href === "/panel"
              ? pathname === "/panel"
              : pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
              className={
                active
                  ? "rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
                  : "rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-200/70"
              }
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-200 p-3">
        <div className="truncate text-xs text-zinc-500">{userLabel}</div>
        <form action={signOutAction} className="mt-2">
          <button
            type="submit"
            className="text-xs font-medium text-zinc-700 underline-offset-2 hover:underline"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
