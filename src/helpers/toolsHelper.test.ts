import Swal from "sweetalert2";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  formatDate,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
  showWarningDialog,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

describe("toolsHelper", () => {
  beforeEach(() => vi.mocked(Swal.fire).mockReset());

  it("formats valid dates and handles invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("-");
    expect(formatDate("2025-01-01T12:00:00.000Z")).toContain("2025");
    expect(formatDate(new Date("2025-01-01T12:00:00.000Z"))).toContain("2025");
  });

  it("shows the appropriate feedback dialog", async () => {
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as Awaited<ReturnType<typeof Swal.fire>>);
    await showSuccessDialog("Tersimpan");
    expect(Swal.fire).toHaveBeenLastCalledWith(expect.objectContaining({ icon: "success", text: "Tersimpan" }));
    await showErrorDialog("Gagal");
    expect(Swal.fire).toHaveBeenLastCalledWith(expect.objectContaining({ icon: "error", text: "Gagal" }));
    await showWarningDialog("Perhatian");
    expect(Swal.fire).toHaveBeenLastCalledWith(expect.objectContaining({ icon: "warning", text: "Perhatian" }));
  });

  it("returns the user's confirmation choice and supports dialog overrides", async () => {
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as Awaited<ReturnType<typeof Swal.fire>>);
    await expect(showConfirmDialog("Yakin?")).resolves.toBe(true);
    expect(Swal.fire).toHaveBeenLastCalledWith(expect.objectContaining({ showCancelButton: true, text: "Yakin?" }));
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: false } as Awaited<ReturnType<typeof Swal.fire>>);
    await expect(showConfirmDialog("Ulangi?", { confirmButtonText: "Lanjut" })).resolves.toBe(false);
    expect(Swal.fire).toHaveBeenLastCalledWith(expect.objectContaining({ confirmButtonText: "Lanjut" }));
  });
});
