"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { isAuthLogout } from "@/features/auth/states/action";
import { showErrorDialog } from "@/helpers/toolsHelper";

export default function NavbarComponent({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const profile = useAppSelector((state) => state.users.profile);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onLogout = async () => {
    try {
      await dispatch(isAuthLogout()).unwrap();
      router.replace("/auth/login");
    } catch (error) {
      await showErrorDialog(String(error));
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            aria-label="Buka navigasi"
            className="grid size-10 place-items-center rounded-xl border border-[var(--line)] text-xl lg:hidden"
            onClick={onMenuClick}
          >
            <FiMenu />
          </button>
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--green)] text-xl font-extrabold text-white">
              R
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              ruang<span className="text-[var(--green)]">cerita</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/profile" className="hidden items-center gap-3 sm:flex">
            <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-[#eaf1e9] font-bold text-[var(--green)]">
              {profile?.photo ? (
                // API photo URLs are user-provided and may be external.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photo} alt="" className="size-full object-cover" />
              ) : (
                profile?.name?.slice(0, 1).toUpperCase() ?? "U"
              )}
            </span>
            <span className="text-left">
              <span className="block text-sm font-bold">{profile?.name ?? "Pengguna"}</span>
              <span className="block text-xs text-[var(--muted)]">Anggota komunitas</span>
            </span>
          </Link>
          <button
            onClick={onLogout}
            className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[var(--muted)] transition hover:bg-[#f3f6f2] hover:text-[var(--ink)]"
            aria-label="Keluar"
          >
            <FiLogOut className="text-lg" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
