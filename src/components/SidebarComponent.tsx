"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FiHome, FiUser, FiUsers, FiX } from "react-icons/fi";

const links = [
  { href: "/", label: "Semua postingan", icon: FiHome },
  { href: "/?mine=1", label: "Postingan saya", icon: FiUser },
  { href: "/users", label: "Komunitas", icon: FiUsers },
];

export default function SidebarComponent({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <>
      {open && (
        <button
          aria-label="Tutup navigasi"
          className="fixed inset-0 z-40 bg-[#152c2b]/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] border-r border-[var(--line)] bg-white p-5 transition-transform lg:sticky lg:top-[76px] lg:z-0 lg:h-[calc(100vh-76px)] lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <span className="font-extrabold">Navigasi</span>
          <button onClick={onClose} aria-label="Tutup navigasi">
            <FiX className="text-xl" />
          </button>
        </div>
        <p className="mb-3 px-3 text-[11px] font-extrabold uppercase tracking-[.18em] text-[var(--muted)]">
          Menu utama
        </p>
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/"
                ? pathname === "/" && searchParams.get("mine") !== "1"
                : href.startsWith("/?")
                  ? pathname === "/" && searchParams.get("mine") === "1"
                  : pathname.startsWith(href);
            return (
              <Link
                href={href}
                key={label}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-[#edf5e8] text-[var(--green)]" : "text-[var(--muted)] hover:bg-[#f6f8f5]"}`}
              >
                <Icon className="text-[19px]" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 rounded-2xl bg-[#f4f7f2] p-4">
          <p className="text-sm font-bold">Satu cerita bisa menginspirasi.</p>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Bagikan hal baik dan tumbuh bersama komunitas.
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e2e9dd]">
            <div className="h-full w-2/3 rounded-full bg-[var(--green)]" />
          </div>
          <p className="mt-2 text-[10px] font-semibold text-[var(--muted)]">
            KOMUNITAS YANG SALING MENDUKUNG
          </p>
        </div>
        <Link
          href="/profile"
          onClick={onClose}
          className={`mt-3 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${pathname.startsWith("/profile") ? "bg-[#edf5e8] text-[var(--green)]" : "text-[var(--muted)] hover:bg-[#f6f8f5]"}`}
        >
          <FiUser className="text-[19px]" />
          Profil saya
        </Link>
      </aside>
    </>
  );
}
