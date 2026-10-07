"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowUpRight, FiBookOpen, FiHeart, FiUsers } from "react-icons/fi";
import { getAccessToken, putAccessToken } from "@/helpers/apiHelper";
import { getProfile } from "@/features/users/api/userApi";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      void Promise.resolve().then(() => setChecking(false));
      return;
    }
    getProfile()
      .then(() => router.replace("/"))
      .catch(() => {
        putAccessToken(null);
        setChecking(false);
      });
  }, [router]);

  if (checking) {
    return <main className="grid min-h-screen place-items-center text-sm text-[var(--muted)]">Memeriksa sesi…</main>;
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[1fr_1fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#123f35] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-28 -top-24 size-[430px] rounded-full border border-white/10" />
        <div className="absolute -right-12 -top-10 size-[300px] rounded-full border border-white/10" />
        <div className="relative z-10">
          <Link href="/auth/login" className="flex items-center gap-3 text-lg font-extrabold">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--lime)] text-xl text-[#173e32]">R</span>{" "}
            ruangcerita
          </Link>
          <div className="mt-28 max-w-xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-[#d7e7db]">
              <span className="size-2 rounded-full bg-[var(--lime)]" /> RUANG UNTUK BERTUMBUH
            </p>
            <h1 className="text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">
              Cerita kecil,<br />dampak yang <span className="text-[var(--lime)]">besar.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#d2e2d9]">
              Tempat berbagi perjalanan, merayakan proses, dan saling menguatkan setiap hari.
            </p>
          </div>
        </div>
        <div className="relative z-10 grid max-w-xl grid-cols-3 gap-3">
          {[
            [FiBookOpen, "Ide bermakna"],
            [FiHeart, "Dukungan tulus"],
            [FiUsers, "Teman bertumbuh"],
          ].map(([Icon, text]) => (
            <div key={String(text)} className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <Icon className="mb-3 text-xl text-[var(--lime)]" />
              <span className="text-xs font-semibold">{String(text)}</span>
            </div>
          ))}
        </div>
        <p className="relative z-10 text-xs text-[#b4cbc0]">© 2026 Ruang Cerita · Delcom Community</p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[430px]">
          <Link href="/auth/login" className="mb-12 flex items-center gap-2 font-extrabold lg:hidden">
            <span className="grid size-9 place-items-center rounded-xl bg-[var(--green)] text-lg text-white">R</span>{" "}
            ruangcerita
          </Link>
          {children}
         <p className="mt-10 text-center text-xs text-[var(--muted)]">
            Berbagi dengan baik, tumbuh bersama.
            <FiArrowUpRight className="ml-1 inline" />
          </p>
        </div>
      </section>
    </main>
  );
}