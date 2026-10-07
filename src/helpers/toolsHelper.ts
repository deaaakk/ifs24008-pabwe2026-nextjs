"use client";

import Swal, { type SweetAlertOptions } from "sweetalert2";

export function showSuccessDialog(message: string): Promise<void> {
  return Swal.fire({ icon: "success", title: "Berhasil", text: message }).then(
    () => undefined,
  );
}

export function showErrorDialog(message: string): Promise<void> {
  return Swal.fire({ icon: "error", title: "Terjadi kesalahan", text: message }).then(
    () => undefined,
  );
}

export function showWarningDialog(message: string): Promise<void> {
  return Swal.fire({ icon: "warning", title: "Perhatian", text: message }).then(
    () => undefined,
  );
}

export function showConfirmDialog(
  message: string,
  options: SweetAlertOptions = {},
): Promise<boolean> {
  return Swal.fire({
    icon: "question",
    title: "Konfirmasi",
    text: message,
    showCancelButton: true,
    confirmButtonText: "Ya, lanjutkan",
    cancelButtonText: "Batal",
    ...options,
  }).then((result) => result.isConfirmed);
}

export function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
