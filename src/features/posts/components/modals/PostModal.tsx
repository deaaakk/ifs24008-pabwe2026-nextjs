"use client";

import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { useInput } from "@/hooks/useInput";

export default function PostModal({
  open,
  initialValue = "",
  title,
  busy = false,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initialValue?: string;
  title: string;
  busy?: boolean;
  onClose: () => void;
  onSubmit: (description: string) => void;
}) {
  const { value, onChange, setValue } = useInput(initialValue);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => setValue(initialValue), [initialValue, open, setValue]);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);
  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="post-modal-title"
      className="fixed inset-0 z-[60] m-0 grid h-dvh w-screen max-h-none max-w-none place-items-center overflow-visible border-0 bg-transparent p-4 backdrop:bg-[#10211f]/45 backdrop:backdrop-blur-sm"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="relative grid size-full place-items-center">
        <button
          type="button"
          aria-label="Tutup dialog"
          onClick={onClose}
          className="absolute inset-0 cursor-default"
        />
        <form
          className="relative z-10 w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl sm:p-8"
          onSubmit={(event) => {
            event.preventDefault();
            if (value.trim()) onSubmit(value.trim());
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[var(--green)]">Ruang berbagi</p><h2 id="post-modal-title" className="mt-1 text-xl font-extrabold">{title}</h2></div>
            <button type="button" onClick={onClose} aria-label="Tutup" className="grid size-10 place-items-center rounded-full bg-[#f4f6f3] text-xl"><FiX /></button>
          </div>
          <label htmlFor="post-description" className="mb-2 block text-sm font-bold">Apa yang ingin kamu ceritakan?</label>
          <textarea id="post-description" required rows={6} maxLength={2000} placeholder="Mulai ceritamu di sini…" value={value} onChange={onChange} className="w-full resize-none rounded-2xl border border-[var(--line)] bg-[#fbfcfa] p-4 text-sm leading-6 outline-none transition focus:border-[var(--green)] focus:ring-4 focus:ring-[#146a5614]" />
          <div className="mt-2 text-right text-xs text-[var(--muted)]">{value.length}/2000</div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-3 text-sm font-semibold text-[var(--muted)] hover:bg-[#f4f6f3]">Batal</button>
            <button disabled={busy || !value.trim()} className="rounded-xl bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f5948] disabled:opacity-50">{busy ? "Menyimpan…" : "Publikasikan"}</button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
