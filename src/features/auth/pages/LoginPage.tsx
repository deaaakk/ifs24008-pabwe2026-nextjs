"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";
import { useInput } from "@/hooks/useInput";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { isAuthLogin } from "@/features/auth/states/action";
import { showErrorDialog } from "@/helpers/toolsHelper";

export default function LoginPage() {
  const email = useInput();
  const password = useInput();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector((state) => state.auth.isAuthLogin);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await dispatch(isAuthLogin({ email: email.value, password: password.value })).unwrap();
      router.replace("/");
    } catch (error) {
      await showErrorDialog(String(error));
    }
  };

  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[var(--green)]">Selamat datang kembali</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Masuk ke ruangmu.</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Lanjutkan berbagi cerita dan terhubung dengan komunitas.</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="block"><span className="mb-2 block text-sm font-bold">Email</span><span className="flex h-12 items-center gap-3 rounded-xl border border-[var(--line)] px-4 text-[var(--muted)] focus-within:border-[var(--green)]"><FiMail /><input id="login-email-input" required type="email" autoComplete="email" placeholder="nama@email.com" {...email} className="w-full bg-transparent text-sm text-[var(--ink)] outline-none" /></span></label>
        <label className="block"><span className="mb-2 block text-sm font-bold">Kata sandi</span><span className="flex h-12 items-center gap-3 rounded-xl border border-[var(--line)] px-4 text-[var(--muted)] focus-within:border-[var(--green)]"><FiLock /><input id="login-password-input" required type="password" autoComplete="current-password" placeholder="Masukkan kata sandi" {...password} className="w-full bg-transparent text-sm text-[var(--ink)] outline-none" /></span></label>
        <button id="login-submit-button" type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--green)] text-sm font-extrabold text-white transition hover:bg-[#0f5948] disabled:opacity-50">{loading ? "Memeriksa akun…" : "Masuk"} <FiArrowRight /></button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--muted)]">Belum punya akun? <Link href="/auth/register" className="font-extrabold text-[var(--green)] hover:underline">Daftar sekarang</Link></p>
    </>
  );
}