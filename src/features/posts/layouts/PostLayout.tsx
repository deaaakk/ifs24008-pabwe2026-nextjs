"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, putAccessToken } from "@/helpers/apiHelper";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchProfile } from "@/features/users/states/action";
import NavbarComponent from "@/features/posts/components/NavbarComponent";
import SidebarComponent from "@/features/posts/components/SidebarComponent";

export default function PostLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.users.profile);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/auth/login");
      return;
    }
    dispatch(fetchProfile())
      .unwrap()
      .then(() => setReady(true))
      .catch(() => {
        putAccessToken(null);
        router.replace("/auth/login");
      });
  }, [dispatch, router]);

  if (!ready || !profile) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--paper)]" aria-live="polite">
        <h1 className="sr-only">Menyiapkan ruang ceritamu</h1>
        <div className="flex items-center gap-3 text-sm font-semibold text-[var(--muted)]">
          <span className="size-5 animate-spin rounded-full border-2 border-[#dbe5dc] border-t-[var(--green)]" />{" "}
          Menyiapkan ruang ceritamu…
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <NavbarComponent onMenuClick={() => setMenuOpen(true)} />
      <div className="mx-auto flex max-w-[1440px]">
        <SidebarComponent open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}