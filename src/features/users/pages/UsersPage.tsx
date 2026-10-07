"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiUsers } from "react-icons/fi";
import { fetchUsers } from "@/features/users/states/action";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { formatDate, showErrorDialog } from "@/helpers/toolsHelper";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, isUsers } = useAppSelector((state) => state.users);
  const [query, setQuery] = useState("");
  useEffect(() => {
    dispatch(fetchUsers()).unwrap().catch((error: unknown) => void showErrorDialog(String(error)));
  }, [dispatch]);
  const filtered = useMemo(() => users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())), [users, query]);

  return (
    <main className="mx-auto max-w-[1000px]" aria-labelledby="users-page-title">
      <div className="mb-8 rounded-[28px] bg-[#eaf2e6] p-7 sm:p-10">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[var(--green)]">Tumbuh bersama</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Kenali komunitasmu.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">Temukan teman berbagi, belajar, dan saling memberi inspirasi.</p>
      </div>
      
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold">Anggota komunitas</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{users.length} orang berbagi ruang yang sama</p>
        </div>
        <label className="flex h-11 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 text-[var(--muted)] sm:w-72">
          <FiSearch aria-hidden="true" />
          {/* PERBAIKAN: Menambahkan placeholder:text-[var(--muted)] agar kontras aman */}
          <input aria-label="Cari anggota berdasarkan nama atau email" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau email" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
        </label>
      </div>
      
      {isUsers && !users.length ? (
        <p className="py-16 text-center text-sm text-[var(--muted)]">Memuat anggota…</p>
      ) : filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((user) => (
            <article key={user.id} className="rounded-[22px] border border-[var(--line)] bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center overflow-hidden rounded-2xl bg-[#edf4e9] font-extrabold text-[var(--green)]">
                  {user.photo ? <img src={user.photo} alt="" className="size-full object-cover" /> : user.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-extrabold">{user.name}</h3>
                  <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-[11px] text-[var(--muted)]">
                <span className="inline-flex items-center gap-1.5"><FiUsers aria-hidden="true" /> Anggota Delcom</span>
                <span>Bergabung {formatDate(user.created_at).split(" pukul")[0]}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-12 text-center text-sm text-[var(--muted)]">Tidak ada anggota yang cocok dengan pencarianmu.</div>
      )}
    </main>
  );
}