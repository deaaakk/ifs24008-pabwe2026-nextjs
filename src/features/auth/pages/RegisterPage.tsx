"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiLock, FiMail, FiUser } from "react-icons/fi";
import { useInput } from "@/hooks/useInput";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { isAuthRegister } from "@/features/auth/states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";

export default function RegisterPage() {
  const name = useInput();
  const email = useInput();
  const password = useInput();
  const confirmation = useInput();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector((state) => state.auth.isAuthRegister);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.value.length < 6) return showErrorDialog("Kata sandi minimal 6 karakter.");
    if (password.value !== confirmation.value) return showErrorDialog("Konfirmasi kata sandi belum cocok.");
    try {
      await dispatch(isAuthRegister({ name: name.value.trim(), email: email.value, password: password.value })).unwrap();
      await showSuccessDialog("Akun berhasil dibuat. Silakan masuk.");
      router.replace("/auth/login");
    } catch (error) {
      await showErrorDialog(String(error));
    }
  };

  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[var(--green)]">Mulai perjalananmu</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Buat akun baru.</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Gabung dengan komunitas yang senang berbagi hal baik.</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block"><span className="mb-2 block text-sm font-bold">Nama lengkap</span><span className="flex h-12 items-center gap-3 rounded-xl border border-[var(--line)] px-4 text-[var(--muted)] focus-within:border-[var(--green)]"><FiUser /><input required minLength={2} autoComplete="name" placeholder="Nama kamu" {...name} className="w-full bg-transparent text-sm text-[var(--ink)] outline-none" /></span></label>
        <label className="block"><span className="mb-2 block text-sm font-bold">Email</span><span className="flex h-12 items-center gap-3 rounded-xl border border-[var(--line)] px-4 text-[var(--muted)] focus-within:border-[var(--green)]"><FiMail /><input required type="email" autoComplete="email" placeholder="nama@email.com" {...email} className="w-full bg-transparent text-sm text-[var(--ink)] outline-none" /></span></label>
        <label className="block"><span className="mb-2 block text-sm font-bold">Kata sandi</span><span className="flex h-12 items-center gap-3 rounded-xl border border-[var(--line)] px-4 text-[var(--muted)] focus-within:border-[var(--green)]"><FiLock /><input required minLength={6} type="password" autoComplete="new-password" placeholder="Minimal 6 karakter" {...password} className="w-full bg-transparent text-sm text-[var(--ink)] outline-none" /></span></label>
        <label className="block"><span className="mb-2 block text-sm font-bold">Ulangi kata sandi</span><span className="flex h-12 items-center gap-3 rounded-xl border border-[var(--line)] px-4 text-[var(--muted)] focus-within:border-[var(--green)]"><FiLock /><input required type="password" autoComplete="new-password" placeholder="Masukkan sekali lagi" {...confirmation} className="w-full bg-transparent text-sm text-[var(--ink)] outline-none" /></span></label>
        <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--green)] text-sm font-extrabold text-white transition hover:bg-[#0f5948] disabled:opacity-50">{loading ? "Membuat akun…" : "Buat akun"} <FiArrowRight /></button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--muted)]">Sudah punya akun? <Link href="/auth/login" className="font-extrabold text-[var(--green)] hover:underline">Masuk</Link></p>
    </>
  );
}
