"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { FiCamera, FiLock, FiSave, FiUser } from "react-icons/fi";
import { changeProfile, changeProfilePassword, changeProfilePhoto } from "@/features/users/states/action";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useInput } from "@/hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { profile, isChangeProfile, isChangeProfilePassword, isChangeProfilePhoto } = useAppSelector((state) => state.users);
  const { value: nameValue, onChange: onNameChange, setValue: setName } = useInput(profile?.name ?? "");
  const { value: emailValue, onChange: onEmailChange, setValue: setEmail } = useInput(profile?.email ?? "");
  const currentPassword = useInput();
  const newPassword = useInput();
  const confirmPassword = useInput();
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    setName(profile?.name ?? "");
    setEmail(profile?.email ?? "");
  }, [profile, setEmail, setName]);

  const handle = async (operation: () => Promise<unknown>, message: string) => {
    try {
      await operation();
      await showSuccessDialog(message);
    } catch (error) {
      await showErrorDialog(String(error));
    }
  };

  if (!profile) return <main className="py-16 text-center" aria-labelledby="profile-loading-title"><h1 id="profile-loading-title" className="sr-only">Pengaturan profil</h1><p className="text-sm text-[var(--muted)]">Memuat profil…</p></main>;
  return (
    <main className="mx-auto max-w-[900px]" aria-labelledby="profile-page-title">
      <div className="mb-8"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[var(--green)]">Ruang pribadimu</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Pengaturan profil.</h1><p className="mt-2 text-sm text-[var(--muted)]">Perbarui informasi akun dan cara orang mengenalmu.</p></div>
      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <section className="rounded-[24px] border border-[var(--line)] bg-white p-6">
          <div className="flex flex-col items-center text-center">
            <span className="grid size-24 place-items-center overflow-hidden rounded-[30px] bg-[#eaf2e6] text-3xl font-extrabold text-[var(--green)]">{profile.photo ? <img src={profile.photo} alt="Foto profil" className="size-full object-cover" /> : profile.name.slice(0, 1).toUpperCase()}</span>
            <h2 className="mt-4 text-lg font-extrabold">{profile.name}</h2><p className="mt-1 text-sm text-[var(--muted)]">{profile.email}</p>
            <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-2.5 text-xs font-bold hover:bg-[#f7f9f6]"><FiCamera />{photo?.name ?? "Pilih foto baru"}<input type="file" accept="image/*" className="sr-only" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} /></label>
            {photo && <button disabled={isChangeProfilePhoto} onClick={() => void handle(async () => { await dispatch(changeProfilePhoto(photo)).unwrap(); setPhoto(null); }, "Foto profil berhasil diperbarui.")} className="mt-3 text-xs font-bold text-[var(--green)] disabled:opacity-50">{isChangeProfilePhoto ? "Mengunggah…" : "Unggah foto"}</button>}
          </div>
          <p className="mt-7 rounded-2xl bg-[#f5f8f3] p-4 text-xs leading-5 text-[var(--muted)]">Gunakan foto yang jelas dan ramah agar komunitas lebih mudah mengenalmu.</p>
        </section>
        <div className="space-y-5">
          <form onSubmit={(event) => { event.preventDefault(); void handle(() => dispatch(changeProfile({ name: nameValue.trim(), email: emailValue })).unwrap(), "Informasi profil berhasil disimpan."); }} className="rounded-[24px] border border-[var(--line)] bg-white p-6">
            <div className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#edf4e9] text-[var(--green)]"><FiUser /></span><div><h2 className="font-extrabold">Informasi dasar</h2><p className="text-xs text-[var(--muted)]">Nama dan email akun</p></div></div>
            <label className="mb-4 block text-xs font-bold">Nama lengkap<input required value={nameValue} onChange={onNameChange} className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] px-3 text-sm font-normal outline-none focus:border-[var(--green)]" /></label>
            <label className="mb-5 block text-xs font-bold">Alamat email<input required type="email" value={emailValue} onChange={onEmailChange} className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] px-3 text-sm font-normal outline-none focus:border-[var(--green)]" /></label>
            <button disabled={isChangeProfile} className="inline-flex items-center gap-2 rounded-xl bg-[var(--green)] px-4 py-3 text-xs font-bold text-white disabled:opacity-50"><FiSave />{isChangeProfile ? "Menyimpan…" : "Simpan perubahan"}</button>
          </form>
          <form onSubmit={(event) => { event.preventDefault(); if (newPassword.value.length < 6) return void showErrorDialog("Kata sandi baru minimal 6 karakter."); if (newPassword.value !== confirmPassword.value) return void showErrorDialog("Konfirmasi kata sandi belum cocok."); void handle(async () => { await dispatch(changeProfilePassword({ password: currentPassword.value, new_password: newPassword.value, new_password_confirmation: confirmPassword.value })).unwrap(); currentPassword.setValue(""); newPassword.setValue(""); confirmPassword.setValue(""); }, "Kata sandi berhasil diperbarui."); }} className="rounded-[24px] border border-[var(--line)] bg-white p-6">
            <div className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#edf4e9] text-[var(--green)]"><FiLock /></span><div><h2 className="font-extrabold">Keamanan akun</h2><p className="text-xs text-[var(--muted)]">Perbarui kata sandi secara berkala</p></div></div>
            <label className="mb-3 block text-xs font-bold">Kata sandi saat ini<input required type="password" value={currentPassword.value} onChange={currentPassword.onChange} className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] px-3 text-sm font-normal outline-none focus:border-[var(--green)]" /></label>
            <label className="mb-3 block text-xs font-bold">Kata sandi baru<input required type="password" value={newPassword.value} onChange={newPassword.onChange} className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] px-3 text-sm font-normal outline-none focus:border-[var(--green)]" /></label>
            <label className="mb-5 block text-xs font-bold">Konfirmasi kata sandi<input required type="password" value={confirmPassword.value} onChange={confirmPassword.onChange} className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] px-3 text-sm font-normal outline-none focus:border-[var(--green)]" /></label>
            <button disabled={isChangeProfilePassword} className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-3 text-xs font-bold text-[var(--ink)] disabled:opacity-50"><FiLock />{isChangeProfilePassword ? "Memperbarui…" : "Ubah kata sandi"}</button>
          </form>
        </div>
      </div>
    </main>
  );
}