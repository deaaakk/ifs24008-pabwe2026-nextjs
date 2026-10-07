"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiArrowRight, FiEdit3, FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchPosts, createPost } from "@/features/posts/states/action";
import { resetPostMutationFlags } from "@/features/posts/states/reducer";
import PostCard from "@/features/posts/components/PostCard";
import AddModal from "@/features/posts/components/modals/AddModal";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const mine = params.get("mine") === "1";
  const { posts, isPost, isPostAdd } = useAppSelector((state) => state.posts);
  const profile = useAppSelector((state) => state.users.profile);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts(mine));
  }, [dispatch, mine]);
  useEffect(() => {
    if (posts.length || !isPost) dispatch(resetPostMutationFlags());
  }, [dispatch, isPost, posts.length]);

  const filteredPosts = useMemo(
    () => posts.filter((post) => `${post.description} ${post.author?.name ?? ""}`.toLowerCase().includes(query.toLowerCase())),
    [posts, query],
  );

  const submitPost = async (description: string) => {
    try {
      await dispatch(createPost(description)).unwrap();
      setModalOpen(false);
      await showSuccessDialog("Ceritamu berhasil dipublikasikan.");
    } catch (error) {
      await showErrorDialog(String(error));
    }
  };

  return (
    <main className="mx-auto max-w-[1050px]" aria-labelledby="home-page-title">
      <h1 id="home-page-title" className="sr-only">Linimasa cerita komunitas</h1>
      <section className="relative mb-8 overflow-hidden rounded-[28px] bg-[#154f41] px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="absolute -right-14 -top-32 size-80 rounded-full border border-white/10" /><div className="absolute -right-5 -top-24 size-64 rounded-full border border-white/10" />
        <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl"><p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-extrabold tracking-[.18em] text-[#edf7ee]">KOMUNITAS DELCOM</p><h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Halo, {profile?.name?.split(" ")[0] ?? "teman"} <span className="text-[var(--lime)]">👋</span><br />ada cerita hari ini?</h1><p className="mt-3 max-w-md text-sm leading-6 text-[#edf7ee]">Bagikan ide, proses, dan hal-hal kecil yang membuat harimu berarti.</p></div>
          <button onClick={() => setModalOpen(true)} className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--lime)] px-5 py-3.5 text-sm font-extrabold text-[#173c31] transition hover:bg-[#e5fb8e]"><FiPlus className="text-lg" /> Tulis cerita</button>
        </div>
      </section>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[var(--green)]">{mine ? "Koleksi pribadimu" : "Linimasa komunitas"}</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">{mine ? "Postingan saya" : "Cerita terbaru"}</h2></div>
        <div className="flex items-center gap-2">
          <Link href="/" className={`rounded-full px-4 py-2 text-xs font-bold ${!mine ? "bg-[var(--green)] text-white" : "bg-white text-[var(--muted)]"}`}>Semua</Link>
          <Link href="/?mine=1" className={`rounded-full px-4 py-2 text-xs font-bold ${mine ? "bg-[var(--green)] text-white" : "bg-white text-[var(--muted)]"}`}>Punya saya</Link>
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 text-[var(--muted)]">
          <FiSearch className="text-lg" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari cerita atau penulis…" className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)]" />
        </label>
        <Link href="/users" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--line)] bg-white px-5 text-sm font-bold text-[var(--green)]"><FiUsers /> Jelajahi komunitas <FiArrowRight /></Link>
      </div>
      {isPost && posts.length === 0 ? <div className="grid min-h-60 place-items-center rounded-3xl border border-[var(--line)] bg-white text-sm text-[var(--muted)]">Memuat cerita…</div> : filteredPosts.length ? <div className="grid gap-5 md:grid-cols-2">{filteredPosts.map((post) => <PostCard key={post.id} post={post} />)}</div> : <div className="rounded-3xl border border-dashed border-[#d7e1d7] bg-white px-6 py-16 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eff5e9] text-2xl text-[var(--green)]"><FiEdit3 /></span><h3 className="mt-4 text-lg font-extrabold">{query ? "Cerita tidak ditemukan" : "Belum ada cerita di sini"}</h3><p className="mt-2 text-sm text-[var(--muted)]">{query ? "Coba kata pencarian yang lain." : "Jadilah yang pertama berbagi cerita hari ini."}</p>{!query && <button onClick={() => setModalOpen(true)} className="mt-5 text-sm font-bold text-[var(--green)]">Mulai menulis <FiArrowRight className="ml-1 inline" /></button>}</div>}
      <AddModal open={modalOpen} busy={isPostAdd} onClose={() => setModalOpen(false)} onSubmit={submitPost} />
    </main>
  );
}