"use client";

import { useEffect, useState } from "react";
import { FiImage, FiX } from "react-icons/fi";

export default function ChangeCoverModal({
  open,
  busy,
  onClose,
  onSubmit,
}: {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => setPreview(String(reader.result ?? "")));
    reader.readAsDataURL(file);
    return () => reader.abort();
  }, [file]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[#10211f]/45 p-4 backdrop-blur-sm">
      <form className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl sm:p-8" onSubmit={(event) => { event.preventDefault(); if (file) onSubmit(file); }}>
        <div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[var(--green)]">Tampilan cerita</p><h2 className="mt-1 text-xl font-extrabold">Ganti cover</h2></div><button type="button" onClick={onClose} aria-label="Tutup" className="grid size-10 place-items-center rounded-full bg-[#f4f6f3] text-xl"><FiX /></button></div>
        <label htmlFor="cover-upload" className="flex min-h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#dce5dc] bg-[#f8faf7] text-center hover:border-[var(--green)]">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview cover" className="h-52 w-full object-cover" />
          ) : <><FiImage className="mb-3 text-3xl text-[var(--green)]" /><span className="text-sm font-bold">Pilih gambar cover</span><span className="mt-1 text-xs text-[var(--muted)]">PNG, JPG, atau WEBP</span></>}
        </label>
        <input id="cover-upload" type="file" accept="image/*" className="sr-only" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setPreview(""); }} />
        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl px-4 py-3 text-sm font-semibold text-[var(--muted)]">Batal</button><button disabled={!file || busy} className="rounded-xl bg-[var(--green)] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? "Mengunggah…" : "Simpan cover"}</button></div>
      </form>
    </div>
  );
}
