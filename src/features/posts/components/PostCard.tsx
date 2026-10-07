"use client";

import Link from "next/link";
import { FiHeart, FiMessageCircle, FiUser } from "react-icons/fi";
import type { Post } from "@/types";
import { formatDate } from "@/helpers/toolsHelper";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-35px_#24483a]">
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#edf4e9] font-bold text-[var(--green)]">
          {post.author?.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.author.photo} alt="" className="size-full object-cover" />
          ) : (
            post.author?.name?.slice(0, 1).toUpperCase() ?? <FiUser />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{post.author?.name ?? "Anggota Delcom"}</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{formatDate(post.created_at)}</p>
        </div>
      </div>
      {post.cover ? (
        <Link href={`/posts/${post.id}`} className="block h-52 overflow-hidden bg-[#f0f3ef]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover} alt="Cover postingan" className="size-full object-cover transition duration-500 hover:scale-[1.03]" />
        </Link>
      ) : null}
      <div className="px-5 pb-5 pt-2">
        <Link href={`/posts/${post.id}`} className="block whitespace-pre-wrap text-[14px] leading-6 text-[#3b4a46]">
          {post.description}
        </Link>
        <div className="mt-5 flex items-center gap-5 border-t border-[var(--line)] pt-4 text-xs font-semibold text-[var(--muted)]">
          <span className="inline-flex items-center gap-2"><FiHeart className="text-base" /> {post.likes?.length ?? 0} suka</span>
          <span className="inline-flex items-center gap-2"><FiMessageCircle className="text-base" /> {post.comments?.length ?? 0} komentar</span>
          <Link href={`/posts/${post.id}`} className="ml-auto text-[var(--green)] hover:underline">Lihat cerita</Link>
        </div>
      </div>
    </article>
  );
}
