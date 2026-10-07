"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiHeart, FiMessageCircle, FiMoreHorizontal, FiSend, FiTrash2 } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { changePostLike, createComment, editPost, editPostCover, fetchPost, removeComment, removePost } from "@/features/posts/states/action";
import ChangeModal from "@/features/posts/components/modals/ChangeModal";
import ChangeCoverModal from "@/features/posts/components/modals/ChangeCoverModal";
import { formatDate, showConfirmDialog, showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";

export default function DetailPage({ postId }: { postId: number }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { post, isPost } = useAppSelector((state) => state.posts);
  const profile = useAppSelector((state) => state.users.profile);
  const [comment, setComment] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ownPost = post?.user_id === profile?.id;
  const liked = Boolean(profile && post?.likes?.includes(profile.id));

  useEffect(() => {
    dispatch(fetchPost(postId));
  }, [dispatch, postId]);

  const withFeedback = async (operation: () => Promise<unknown>, successMessage: string) => {
    setBusy(true);
    try {
      await operation();
      await showSuccessDialog(successMessage);
    } catch (error) {
      await showErrorDialog(String(error));
    } finally {
      setBusy(false);
    }
  };

  if (isPost && !post) return <main className="py-20 text-center text-sm text-[var(--muted)]" aria-labelledby="detail-loading-title"><h1 id="detail-loading-title" className="sr-only">Detail cerita</h1>Memuat cerita…</main>;
  if (!post) return <main className="py-20 text-center" aria-labelledby="detail-not-found-title"><h1 id="detail-not-found-title" className="font-bold">Postingan tidak ditemukan.</h1><Link href="/" className="mt-3 inline-block text-sm text-[var(--green)]">Kembali ke linimasa</Link></main>;

  return (
    <main className="mx-auto max-w-[820px]" aria-labelledby="detail-page-title">
      <h1 id="detail-page-title" className="sr-only">Cerita dari {post.author?.name ?? "Anggota Delcom"}</h1>
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--green)]"><FiArrowLeft /> Kembali ke linimasa</Link>
      <div className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-white">
        <div className="flex items-center gap-3 p-5 sm:p-7">
          <span className="grid size-12 place-items-center overflow-hidden rounded-full bg-[#edf4e9] font-bold text-[var(--green)]">{post.author?.photo ? <img src={post.author.photo} alt="" className="size-full object-cover" /> : post.author?.name?.slice(0, 1) ?? "U"}</span>
          <div className="flex-1"><p className="font-extrabold">{post.author?.name ?? "Anggota Delcom"}</p><p className="mt-1 text-xs text-[var(--muted)]">{formatDate(post.created_at)}</p></div>
          {ownPost && <div className="relative flex gap-2"><button onClick={() => setEditOpen(true)} className="rounded-xl px-3 py-2 text-xs font-bold text-[var(--green)] hover:bg-[#eff5e9]">Ubah</button><button onClick={() => setCoverOpen(true)} className="rounded-xl px-3 py-2 text-xs font-bold text-[var(--green)] hover:bg-[#eff5e9]">Cover</button><button aria-label="Hapus postingan" onClick={async () => { if (await showConfirmDialog("Postingan ini akan dihapus permanen.")) await withFeedback(async () => { await dispatch(removePost(post.id)).unwrap(); router.replace("/"); }, "Postingan berhasil dihapus."); }} className="grid size-9 place-items-center rounded-xl text-red-500 hover:bg-red-50"><FiTrash2 /></button></div>}
        </div>
        {post.cover && <div className="max-h-[520px] overflow-hidden bg-[#f1f4f0]">
          <img src={post.cover} alt="Cover postingan" className="max-h-[520px] w-full object-cover" />
        </div>}
        <div className="p-5 sm:p-7">
          <p className="whitespace-pre-wrap text-[15px] leading-7 text-[#354541]">{post.description}</p>
          <div className="mt-7 flex items-center gap-4 border-y border-[var(--line)] py-4">
            <button disabled={busy} onClick={() => void withFeedback(() => dispatch(changePostLike({ id: post.id, like: !liked })).unwrap(), liked ? "Like dibatalkan." : "Kamu menyukai cerita ini.")} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${liked ? "bg-[#fff0ef] text-[#b42318]" : "bg-[#f5f7f3] text-[var(--muted)] hover:text-[#b42318]"}`}><FiHeart /> {post.likes?.length ?? 0} suka</button>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)]"><FiMessageCircle /> {post.comments?.length ?? 0} komentar</span>
          </div>
          <form className="mt-5 flex gap-3" onSubmit={(event) => { event.preventDefault(); if (comment.trim()) void withFeedback(async () => { await dispatch(createComment({ id: post.id, comment: comment.trim() })).unwrap(); setComment(""); }, "Komentar berhasil dikirim."); }}>
            <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Tulis komentar yang baik…" className="h-12 min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[#fbfcfa] px-4 text-sm outline-none focus:border-[var(--green)]" />
            <button disabled={busy || !comment.trim()} aria-label="Kirim komentar" className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--green)] text-lg text-white disabled:opacity-50"><FiSend /></button>
          </form>
          <section className="mt-8">
            <h2 className="mb-4 text-sm font-extrabold">Percakapan <span className="ml-1 text-[var(--muted)]">{post.comments?.length ?? 0}</span></h2>
            <div className="space-y-4">
              {(post.comments ?? []).filter((entry): entry is Exclude<typeof entry, number> => typeof entry !== "number").map((item) => (
                <div key={item.id} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#edf4e9] text-xs font-bold text-[var(--green)]">{item.author?.name?.slice(0, 1) ?? "U"}</span>
                  <div className="min-w-0 flex-1 rounded-2xl bg-[#f6f8f5] px-4 py-3">
                    <div className="flex items-center justify-between gap-3"><p className="text-xs font-extrabold">{item.author?.name ?? "Anggota Delcom"}</p>{post.my_comment?.id === item.id && <button aria-label="Hapus komentar" onClick={() => void withFeedback(() => dispatch(removeComment(post.id)).unwrap(), "Komentar dihapus.")} className="text-[var(--muted)] hover:text-red-500"><FiTrash2 /></button>}</div>
                    <p className="mt-1 text-sm leading-6 text-[#53615d]">{item.comment}</p><p className="mt-2 text-[10px] text-[var(--muted)]">{formatDate(item.created_at)}</p>
                  </div>
                </div>
              ))}
              {post.comments?.length === 0 && <p className="rounded-xl bg-[#f6f8f5] p-4 text-sm text-[var(--muted)]">Belum ada komentar. Mulai percakapan yang hangat.</p>}
            </div>
          </section>
        </div>
      </div>
      <ChangeModal open={editOpen} initialValue={post.description} busy={busy} onClose={() => setEditOpen(false)} onSubmit={(description) => { void withFeedback(async () => { await dispatch(editPost({ id: post.id, description })).unwrap(); setEditOpen(false); }, "Postingan berhasil diperbarui."); }} />
      <ChangeCoverModal open={coverOpen} busy={busy} onClose={() => setCoverOpen(false)} onSubmit={(cover) => { void withFeedback(async () => { await dispatch(editPostCover({ id: post.id, cover })).unwrap(); setCoverOpen(false); }, "Cover berhasil diperbarui."); }} />
      <span className="sr-only"><FiMoreHorizontal /></span>
    </main>
  );
}