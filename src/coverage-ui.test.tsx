import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { Post, PostComment } from "@/types";
import type { RootState } from "./store";

import SidebarComponent from "./components/SidebarComponent";
import NavbarComponent from "./components/NavbarComponent";
import Providers from "./components/Providers";
import StoreProvider from "./StoreProvider";
import RootLayout from "./app/layout";
import DashboardLayout from "./app/(dashboard)/layout";
import AuthenticationLayout from "./app/auth/layout";
import LoginPageRoute from "./app/auth/login/page";
import RegisterPageRoute from "./app/auth/register/page";
import DashboardPage from "./app/(dashboard)/page";
import UsersPageRoute from "./app/(dashboard)/users/page";
import ProfilePageRoute from "./app/(dashboard)/profile/page";
import DetailPageRoute from "./app/(dashboard)/posts/[postId]/page";
import AuthLayout from "./features/auth/layouts/AuthLayout";
import PostLayout from "./features/posts/layouts/PostLayout";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import PostCard from "./features/posts/components/PostCard";
import PostModal from "./features/posts/components/modals/PostModal";
import AddModal from "./features/posts/components/modals/AddModal";
import ChangeModal from "./features/posts/components/modals/ChangeModal";
import ChangeCoverModal from "./features/posts/components/modals/ChangeCoverModal";
import HomePage from "./features/posts/pages/HomePage";
import DetailPage from "./features/posts/pages/DetailPage";
import ProfilePage from "./features/users/pages/ProfilePage";
import UsersPage from "./features/users/pages/UsersPage";

const mockRouterReplace = vi.fn();
const mockPathname = vi.fn();
const mockSearchParams = vi.fn();
const mockDispatch = vi.fn();
type CoveragePost = Omit<Post, "author" | "likes" | "comments"> & {
  author?: Post["author"] | null;
  likes?: number[];
  comments?: Array<number | PostComment>;
};
type MockState = {
  auth?: Partial<RootState["auth"]>;
  users?: Partial<RootState["users"]>;
  posts?: Partial<Omit<RootState["posts"], "post" | "posts">> & {
    post?: CoveragePost | null;
    posts?: CoveragePost[];
  };
};
let mockState: MockState = {};
const mockShowSuccessDialog = vi.fn();
const mockShowErrorDialog = vi.fn();
const mockShowConfirmDialog = vi.fn();
const mockGetAccessToken = vi.fn();
const mockPutAccessToken = vi.fn();
const mockGetProfile = vi.fn();

Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
  configurable: true,
  value: function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  },
});
Object.defineProperty(HTMLDialogElement.prototype, "close", {
  configurable: true,
  value: function (this: HTMLDialogElement) {
    this.removeAttribute("open");
  },
});

vi.mock("next/font/google", () => ({
  Plus_Jakarta_Sans: () => ({ variable: "--font-plus-jakarta" }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockRouterReplace }),
  usePathname: () => mockPathname(),
  useSearchParams: () => ({ get: (key: string) => mockSearchParams(key) }),
}));

vi.mock("@/hooks/redux", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: RootState) => unknown) => selector(mockState as RootState),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  formatDate: (value: string | Date) => (value instanceof Date ? "1 Januari 2024" : value),
  showSuccessDialog: (...args: unknown[]) => mockShowSuccessDialog(...args),
  showErrorDialog: (...args: unknown[]) => mockShowErrorDialog(...args),
  showConfirmDialog: (...args: unknown[]) => mockShowConfirmDialog(...args),
}));

vi.mock("@/helpers/apiHelper", () => ({
  getAccessToken: (...args: unknown[]) => mockGetAccessToken(...args),
  putAccessToken: (...args: unknown[]) => mockPutAccessToken(...args),
}));

vi.mock("@/features/users/api/userApi", () => ({
  getProfile: (...args: unknown[]) => mockGetProfile(...args),
}));

const profile = {
  id: 7,
  name: "Ayu",
  email: "ayu@example.com",
  photo: null,
  created_at: "2024-01-01T00:00:00.000Z",
};

const post = {
  id: 11,
  user_id: 7,
  description: "Cerita hari ini",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  cover: "https://example.com/cover.jpg",
  author: { name: "Ayu", photo: null },
  likes: [7],
  comments: [{ id: 2, comment: "Bagus", created_at: "2024-01-01T00:00:00.000Z", author: { name: "Rina" } }],
  my_comment: null,
};

beforeEach(() => {
  mockRouterReplace.mockReset();
  mockPathname.mockReset();
  mockSearchParams.mockReset();
  mockDispatch.mockReset();
  mockShowSuccessDialog.mockReset();
  mockShowErrorDialog.mockReset();
  mockShowConfirmDialog.mockReset();
  mockGetAccessToken.mockReset();
  mockPutAccessToken.mockReset();
  mockGetProfile.mockReset();
  mockShowSuccessDialog.mockResolvedValue(undefined);
  mockShowErrorDialog.mockResolvedValue(undefined);
  mockShowConfirmDialog.mockResolvedValue(true);
  mockDispatch.mockImplementation(() => ({ unwrap: async () => undefined }));
  mockState = {
    auth: { isAuthLogin: false, isAuthRegister: false },
    users: { profile, users: [], isUsers: false, isChangeProfile: false, isChangeProfilePhoto: false, isChangeProfilePassword: false },
    posts: { posts: [post], post, isPost: false, isPostAdd: false },
  };
  mockPathname.mockReturnValue("/");
  mockSearchParams.mockImplementation(() => null);
  mockGetAccessToken.mockReturnValue(null);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("ui coverage suite", () => {
  it("renders wrappers and root app shell", () => {
    render(<Providers><div>provider</div></Providers>);
    render(<StoreProvider><div>store</div></StoreProvider>);
    render(<RootLayout><div>root</div></RootLayout>);
    render(<DashboardLayout><div>dashboard</div></DashboardLayout>);
    render(<AuthenticationLayout><div>auth</div></AuthenticationLayout>);
    render(<LoginPageRoute />);
    render(<RegisterPageRoute />);
    render(<DashboardPage />);
    render(<UsersPageRoute />);
    render(<ProfilePageRoute />);
    render(<DetailPageRoute params={Promise.resolve({ postId: "11" })} />);

    expect(screen.getByText("provider")).toBeInTheDocument();
    expect(screen.getByText("store")).toBeInTheDocument();
    expect(screen.getByText("root")).toBeInTheDocument();
  });

  it("renders sidebar navigation and close button", () => {
    mockPathname.mockReturnValue("/profile");
    mockSearchParams.mockImplementation((key: string) => (key === "mine" ? "1" : null));

    const onClose = vi.fn();
    render(<SidebarComponent open onClose={onClose} />);
    const closeButtons = screen.getAllByLabelText("Tutup navigasi");
    fireEvent.click(closeButtons[closeButtons.length - 1]);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Menu utama")).toBeInTheDocument();
    expect(screen.getByText("Profil saya")).toBeInTheDocument();
  });

  it("renders navbar and handles logout success and reject flows", async () => {
    mockState = { users: { profile } };

    const { rerender } = render(<NavbarComponent onMenuClick={vi.fn()} />);
    mockDispatch.mockImplementation(() => ({ unwrap: async () => undefined }));
    fireEvent.click(screen.getByLabelText("Keluar"));
    await waitFor(() => expect(mockRouterReplace).toHaveBeenCalledWith("/auth/login"));

    mockRouterReplace.mockClear();
    mockDispatch.mockImplementation(() => ({ unwrap: async () => { throw new Error("logout failed"); } }));
    rerender(<NavbarComponent onMenuClick={vi.fn()} />);
    fireEvent.click(screen.getByLabelText("Keluar"));
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledWith("Error: logout failed"));

    mockState = { users: { profile: { ...profile, photo: "https://example.com/avatar.png" } } };
    rerender(<NavbarComponent onMenuClick={vi.fn()} />);
    expect(screen.getByAltText("")).toHaveAttribute("src", "https://example.com/avatar.png");

    mockState = { users: { profile: null } };
    rerender(<NavbarComponent onMenuClick={vi.fn()} />);
    expect(screen.getByText("Pengguna")).toBeInTheDocument();
  });

  it("handles auth layout session checks", async () => {
    mockGetAccessToken.mockReturnValue(null);
    const { rerender } = render(<AuthLayout><div>child</div></AuthLayout>);
    await waitFor(() => expect(screen.getByText("child")).toBeInTheDocument());

    mockGetAccessToken.mockReturnValue("token");
    mockGetProfile.mockResolvedValue({ name: "Ayu" });
    rerender(<AuthLayout><div>valid</div></AuthLayout>);
    await waitFor(() => expect(mockRouterReplace).toHaveBeenCalledWith("/"));

    mockGetProfile.mockRejectedValue(new Error("bad"));
    rerender(<AuthLayout><div>retry</div></AuthLayout>);
    await waitFor(() => expect(mockPutAccessToken).toHaveBeenCalledWith(null));
  });

  it("redirects from the dashboard when the session is missing or invalid", async () => {
    mockGetAccessToken.mockReturnValue(null);
    const { rerender } = render(<PostLayout><div>dashboard child</div></PostLayout>);
    await waitFor(() => expect(mockRouterReplace).toHaveBeenCalledWith("/auth/login"));

    mockRouterReplace.mockClear();
    mockGetAccessToken.mockReturnValue("expired");
    mockDispatch.mockImplementation(() => ({ unwrap: async () => { throw new Error("expired"); } }));
    rerender(<PostLayout><div>retry dashboard</div></PostLayout>);
    await waitFor(() => {
      expect(mockPutAccessToken).toHaveBeenCalledWith(null);
      expect(mockRouterReplace).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("shows the dashboard after profile loading and toggles the mobile sidebar", async () => {
    mockGetAccessToken.mockReturnValue("valid");
    mockDispatch.mockImplementation(() => ({ unwrap: async () => profile }));
    render(<PostLayout><div>dashboard child</div></PostLayout>);

    await waitFor(() => expect(screen.getByText("dashboard child")).toBeInTheDocument());
    fireEvent.click(screen.getByLabelText("Buka navigasi"));
    fireEvent.click(screen.getAllByLabelText("Tutup navigasi")[0]);
    expect(screen.getByText("dashboard child")).toBeInTheDocument();
  });

  it("submits login and register forms with validation states", async () => {
    mockDispatch.mockImplementation(() => ({ unwrap: async () => undefined }));
    const user = userEvent.setup();

    const { unmount } = render(<LoginPage />);
    await user.type(screen.getAllByLabelText(/Email/i)[0], "ayu@example.com");
    await user.type(screen.getAllByLabelText(/Kata sandi/i)[0], "secret123");
    fireEvent.click(screen.getAllByRole("button", { name: /Masuk/i })[0]);
    await waitFor(() => expect(mockRouterReplace).toHaveBeenCalledWith("/"));

    unmount();
    mockRouterReplace.mockClear();
    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText(/Nama lengkap/i), { target: { value: "Ayu" } });
    fireEvent.change(screen.getAllByLabelText(/Email/i)[0], { target: { value: "ayu@example.com" } });
    fireEvent.change(screen.getAllByLabelText(/Kata sandi/i)[0], { target: { value: "short" } });
    fireEvent.change(screen.getAllByLabelText(/Ulangi kata sandi/i)[0], { target: { value: "short" } });
    fireEvent.submit(screen.getAllByRole("button", { name: /Buat akun/i })[0].closest("form")!);
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledWith("Kata sandi minimal 6 karakter."));

    fireEvent.change(screen.getAllByLabelText(/Kata sandi/i)[0], { target: { value: "secret123" } });
    fireEvent.change(screen.getAllByLabelText(/Ulangi kata sandi/i)[0], { target: { value: "different" } });
    fireEvent.submit(screen.getAllByRole("button", { name: /Buat akun/i })[0].closest("form")!);
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledWith("Konfirmasi kata sandi belum cocok."));
  });

  it("reports login and registration request errors", async () => {
    mockDispatch.mockImplementation(() => ({ unwrap: async () => { throw new Error("request failed"); } }));

    const login = render(<LoginPage />);
    fireEvent.submit(login.container.querySelector("form")!);
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledWith("Error: request failed"));
    login.unmount();

    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText(/Nama lengkap/i), { target: { value: "Ayu" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "ayu@example.com" } });
    fireEvent.change(screen.getAllByLabelText(/Kata sandi/i)[0], { target: { value: "secret123" } });
    fireEvent.change(screen.getByLabelText(/Ulangi kata sandi/i), { target: { value: "secret123" } });
    fireEvent.submit(screen.getByRole("button", { name: /Buat akun/i }).closest("form")!);
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledWith("Error: request failed"));
  });

  it("creates an account and navigates to login after success", async () => {
    mockDispatch.mockImplementation(() => ({ unwrap: async () => undefined }));
    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText(/Nama lengkap/i), { target: { value: " Ayu " } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "ayu@example.com" } });
    fireEvent.change(screen.getAllByLabelText(/Kata sandi/i)[0], { target: { value: "secret123" } });
    fireEvent.change(screen.getByLabelText(/Ulangi kata sandi/i), { target: { value: "secret123" } });
    fireEvent.submit(screen.getByRole("button", { name: /Buat akun/i }).closest("form")!);

    await waitFor(() => {
      expect(mockShowSuccessDialog).toHaveBeenCalledWith("Akun berhasil dibuat. Silakan masuk.");
      expect(mockRouterReplace).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("renders disabled loading states for auth forms", () => {
    mockState = { auth: { isAuthLogin: true, isAuthRegister: true } };
    const login = render(<LoginPage />);
    expect(screen.getByRole("button", { name: "Memeriksa akun…" })).toBeDisabled();
    login.unmount();

    render(<RegisterPage />);
    expect(screen.getByRole("button", { name: "Membuat akun…" })).toBeDisabled();
  });

  it("renders post card, modal, and cover modal interactions", async () => {
    render(<PostCard post={post} />);
    expect(screen.getByText("Cerita hari ini")).toBeInTheDocument();

    const onSubmit = vi.fn();
    const postModal = render(<PostModal open title="Tulis cerita" onClose={vi.fn()} onSubmit={onSubmit} />);
    const postText = screen.getAllByLabelText(/Apa yang ingin kamu ceritakan/i).at(-1)!;
    fireEvent.change(postText, { target: { value: "Halo" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Publikasikan/i })[0]);
    expect(onSubmit).toHaveBeenCalledWith("Halo");
    postModal.unmount();

    const addModal = render(<AddModal open onClose={vi.fn()} onSubmit={onSubmit} />);
    const addText = screen.getAllByLabelText(/Apa yang ingin kamu ceritakan/i).at(-1)!;
    fireEvent.change(addText, { target: { value: "Baru" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Publikasikan/i })[0]);
    expect(onSubmit).toHaveBeenLastCalledWith("Baru");
    addModal.unmount();

    const changeModal = render(<ChangeModal open initialValue="Awal" onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByDisplayValue("Awal")).toBeInTheDocument();
    changeModal.unmount();

    const file = new File(["hello"], "cover.png", { type: "image/png" });
    const onCoverSubmit = vi.fn();
    const coverModal = render(<ChangeCoverModal open busy={false} onClose={vi.fn()} onSubmit={onCoverSubmit} />);
    const coverInput = document.getElementById("cover-upload") as HTMLInputElement;
    fireEvent.change(coverInput, { target: { files: [file] } });
    const form = screen.getAllByRole("button", { name: /Simpan cover/i })[0].closest("form");
    if (form) fireEvent.submit(form);
    expect(onCoverSubmit).toHaveBeenCalledWith(file);
    coverModal.unmount();
  });

  it("covers optional post-card content and modal dismissal/empty states", () => {
    const sparsePost = {
      ...post,
      author: { name: "" },
      cover: null,
      likes: [],
      comments: [],
    };
    render(<PostCard post={sparsePost} />);
    expect(screen.getByText("0 suka")).toBeInTheDocument();
    expect(screen.getByText("0 komentar")).toBeInTheDocument();

    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const closed = render(<PostModal open={false} title="Draft" onClose={onClose} onSubmit={onSubmit} />);
    expect(closed.container).toBeEmptyDOMElement();
    closed.unmount();

    const modal = render(<PostModal open busy title="Draft" initialValue="  " onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByRole("button", { name: "Menyimpan…" })).toBeDisabled();
    fireEvent.submit(modal.container.querySelector("form")!);
    expect(onSubmit).not.toHaveBeenCalled();
    const dialog = screen.getByRole("dialog", { name: "Draft" }) as HTMLDialogElement;
    expect(dialog.tagName).toBe("DIALOG");
    fireEvent.click(screen.getByRole("button", { name: "Tutup dialog" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Tutup" }));
    expect(onClose).toHaveBeenCalledTimes(2);
    fireEvent(dialog, new Event("cancel", { bubbles: true, cancelable: true }));
    expect(onClose).toHaveBeenCalledTimes(3);
    dialog.close();
    modal.rerender(<PostModal open={false} title="Draft" onClose={onClose} onSubmit={onSubmit} />);
  });

  it("renders a post card with a remote author photo and malformed optional fields", () => {
    const withPhoto = { ...post, author: { name: "Ayu", photo: "https://example.com/author.png" } };
    const photoCard = render(<PostCard post={withPhoto} />);
    expect(screen.getByAltText("")).toHaveAttribute("src", "https://example.com/author.png");
    photoCard.unmount();

    const sparsePost = {
      ...post,
      author: undefined,
      likes: undefined,
      comments: undefined,
      cover: null,
    } as unknown as typeof post;
    render(<PostCard post={sparsePost} />);
    expect(screen.getByText("Anggota Delcom")).toBeInTheDocument();
    expect(screen.getByText("0 suka")).toBeInTheDocument();
    expect(screen.getByText("0 komentar")).toBeInTheDocument();
  });

  it("covers cover modal file selection, preview, busy state, and cancellation", async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const file = new File(["image"], "cover.png", { type: "image/png" });
    const modal = render(<ChangeCoverModal open busy onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByRole("button", { name: "Mengunggah…" })).toBeDisabled();
    fireEvent.submit(modal.container.querySelector("form")!);
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.change(document.getElementById("cover-upload")!, { target: { files: [file] } });
    await waitFor(() => expect(screen.getByAltText("Preview cover")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Tutup" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("uses an empty preview when the FileReader result is null and accepts clearing a selection", async () => {
    class EmptyResultFileReader extends FileReader {
      override readAsDataURL() {
        this.dispatchEvent(new ProgressEvent("load"));
      }
    }
    vi.stubGlobal("FileReader", EmptyResultFileReader);
    const readAsDataURL = vi.spyOn(EmptyResultFileReader.prototype, "readAsDataURL");
    const onSubmit = vi.fn();
    render(<ChangeCoverModal open busy={false} onClose={vi.fn()} onSubmit={onSubmit} />);
    const input = document.getElementById("cover-upload")!;

    fireEvent.change(input, { target: { files: [] } });
    fireEvent.submit(input.closest("form")!);
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { files: [new File(["cover"], "cover.png", { type: "image/png" })] } });
    await waitFor(() => expect(readAsDataURL).toHaveBeenCalledOnce());
    expect(screen.getByText("Pilih gambar cover")).toBeInTheDocument();
  });

  it("renders home page states and submission flow", async () => {
    mockSearchParams.mockImplementation((key: string) => (key === "mine" ? "1" : null));
    mockState = {
      users: { profile },
      posts: { posts: [], isPost: true, isPostAdd: false },
    };

    const { rerender } = render(<HomePage />);
    expect(screen.getByText("Memuat cerita…")).toBeInTheDocument();

    mockState = {
      users: { profile },
      posts: { posts: [post], isPost: false, isPostAdd: false },
    };
    rerender(<HomePage />);
    expect(screen.getByText("Postingan saya")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /Tulis cerita/i })[0]);
    fireEvent.change(screen.getAllByLabelText(/Apa yang ingin kamu ceritakan/i).at(-1)!, { target: { value: "Baru" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Publikasikan/i })[0]);
    await waitFor(() => expect(mockShowSuccessDialog).toHaveBeenCalledWith("Ceritamu berhasil dipublikasikan."));
  });

  it("handles empty timelines, searching, and failed post submissions", async () => {
    mockSearchParams.mockReturnValue(null);
    mockState = {
      users: { profile: null },
      posts: { posts: [], isPost: false, isPostAdd: true },
    };
    const { rerender } = render(<HomePage />);
    expect(screen.getByRole("heading", { name: /Halo,\s*teman/ })).toBeInTheDocument();
    expect(screen.getByText("Belum ada cerita di sini")).toBeInTheDocument();
    expect(screen.getByText("Semua")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Mulai menulis/i }));
    fireEvent.click(screen.getByRole("button", { name: "Tutup" }));
    expect(screen.queryByRole("button", { name: "Tutup" })).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Cari cerita atau penulis…"), { target: { value: "missing" } });
    expect(screen.getByText("Cerita tidak ditemukan")).toBeInTheDocument();

    mockState = {
      users: { profile: null },
      posts: { posts: [{ ...post, author: null }], isPost: false, isPostAdd: true },
    };
    rerender(<HomePage />);
    fireEvent.click(screen.getByRole("button", { name: /Tulis cerita/i }));
    expect(screen.getByRole("button", { name: "Menyimpan…" })).toBeDisabled();

    mockState = {
      users: { profile: null },
      posts: { posts: [{ ...post, author: null }], isPost: false, isPostAdd: false },
    };
    rerender(<HomePage />);
    mockDispatch.mockImplementation(() => ({ unwrap: async () => { throw new Error("create failed"); } }));
    fireEvent.change(screen.getByLabelText(/Apa yang ingin kamu ceritakan/i), { target: { value: "new post" } });
    fireEvent.click(screen.getByRole("button", { name: /Publikasikan/i }));
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledWith("Error: create failed"));
  });

  it("renders detail page with interactions", async () => {
    mockState = {
      users: { profile },
      posts: { post, isPost: false },
    };
    mockShowConfirmDialog.mockResolvedValue(true);

    const { rerender } = render(<DetailPage postId={11} />);
    expect(screen.getByText("Cerita dari Ayu")).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: /suka/i })[0]);
    fireEvent.change(screen.getByPlaceholderText("Tulis komentar yang baik…"), { target: { value: "Komentar baru" } });
    fireEvent.click(screen.getByLabelText("Kirim komentar"));

    mockState = {
      users: { profile },
      posts: { post, isPost: false },
    };
    rerender(<DetailPage postId={11} />);
    fireEvent.click(screen.getAllByLabelText("Hapus postingan")[0]);
    await waitFor(() => expect(mockShowConfirmDialog).toHaveBeenCalled());
  });

  it("renders detail loading and not-found states", () => {
    mockState = { users: { profile: null }, posts: { post: null, isPost: true } };
    const { rerender } = render(<DetailPage postId={999} />);
    expect(screen.getByText("Memuat cerita…")).toBeInTheDocument();

    mockState = { users: { profile: null }, posts: { post: null, isPost: false } };
    rerender(<DetailPage postId={999} />);
    expect(screen.getByText("Postingan tidak ditemukan.")).toBeInTheDocument();
  });

  it("handles detail edits, cover replacement, comment deletion, and rejected operations", async () => {
    const postWithMyComment = {
      ...post,
      author: { name: "Ayu", photo: "https://example.com/avatar.png" },
      my_comment: { id: 2, comment: "Bagus", created_at: "2024-01-01", author: { name: "Rina" } },
    };
    mockState = { users: { profile }, posts: { post: postWithMyComment, isPost: false } };
    mockDispatch.mockImplementation(() => ({ unwrap: async () => { throw new Error("update failed"); } }));

    render(<DetailPage postId={11} />);
    expect(screen.getByAltText("Cover postingan")).toBeInTheDocument();
    expect(screen.getByAltText("")).toHaveAttribute("src", "https://example.com/avatar.png");
    fireEvent.click(screen.getByRole("button", { name: "Ubah" }));
    fireEvent.change(screen.getByDisplayValue("Cerita hari ini"), { target: { value: "Edited" } });
    fireEvent.submit(screen.getByDisplayValue("Edited").closest("form")!);
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledWith("Error: update failed"));
    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByRole("heading", { name: "Ubah cerita" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cover" }));
    fireEvent.change(document.getElementById("cover-upload")!, { target: { files: [new File(["cover"], "new.png", { type: "image/png" })] } });
    fireEvent.submit(screen.getByRole("button", { name: "Simpan cover" }).closest("form")!);
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledTimes(2));
    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByRole("heading", { name: "Ganti cover" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Hapus komentar"));
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledTimes(3));

    mockDispatch.mockImplementation(() => ({ unwrap: async () => undefined }));
    fireEvent.click(screen.getByRole("button", { name: "Ubah" }));
    fireEvent.change(screen.getByDisplayValue("Cerita hari ini"), { target: { value: "Successful edit" } });
    fireEvent.submit(screen.getByDisplayValue("Successful edit").closest("form")!);
    await waitFor(() => expect(mockShowSuccessDialog).toHaveBeenCalledWith("Postingan berhasil diperbarui."));

    fireEvent.click(screen.getByRole("button", { name: "Cover" }));
    fireEvent.submit(screen.getByRole("button", { name: "Simpan cover" }).closest("form")!);
    await waitFor(() => expect(mockShowSuccessDialog).toHaveBeenCalledWith("Cover berhasil diperbarui."));
  });

  it("shows fallbacks for sparse detail content and handles rejected deletion", async () => {
    const sparsePost = { ...post, author: null, cover: null, likes: undefined, comments: [] };
    mockState = {
      users: { profile: null },
      posts: { post: sparsePost, isPost: false },
    };
    mockShowConfirmDialog.mockResolvedValue(true);
    mockDispatch.mockImplementation(() => ({ unwrap: async () => { throw new Error("delete failed"); } }));

    const { rerender } = render(<DetailPage postId={11} />);
    expect(screen.getByText("Anggota Delcom")).toBeInTheDocument();
    expect(screen.getByText("Belum ada komentar. Mulai percakapan yang hangat.")).toBeInTheDocument();
    mockState = { users: { profile: null }, posts: { post: { ...sparsePost, comments: undefined }, isPost: false } };
    rerender(<DetailPage postId={11} />);
    fireEvent.submit(screen.getByPlaceholderText("Tulis komentar yang baik…").closest("form")!);
    fireEvent.click(screen.getByRole("button", { name: /suka/i }));
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledWith("Error: delete failed"));
  });

  it("deletes owned posts only after confirmation and supports comment posting success", async () => {
    const postWithSparseComment = {
      ...post,
      comments: [
        3,
        { id: 4, comment: "Anonymous", created_at: "2024-01-01T00:00:00.000Z" },
      ],
    };
    mockState = { users: { profile }, posts: { post: postWithSparseComment, isPost: false } };
    mockShowConfirmDialog.mockResolvedValue(false);
    mockDispatch.mockImplementation(() => ({ unwrap: async () => undefined }));
    render(<DetailPage postId={11} />);

    expect(screen.getByText("U")).toBeInTheDocument();
    expect(screen.getByText("Anggota Delcom")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Hapus postingan"));
    await waitFor(() => expect(mockShowConfirmDialog).toHaveBeenCalled());

    mockShowConfirmDialog.mockResolvedValue(true);
    fireEvent.click(screen.getByLabelText("Hapus postingan"));
    await waitFor(() => expect(mockRouterReplace).toHaveBeenCalledWith("/"));
  });

  it("publishes a non-empty comment and reports successful mutations", async () => {
    mockState = { users: { profile }, posts: { post, isPost: false } };
    mockDispatch.mockImplementation(() => ({ unwrap: async () => undefined }));
    render(<DetailPage postId={11} />);
    fireEvent.change(screen.getByPlaceholderText("Tulis komentar yang baik…"), { target: { value: "A thoughtful comment" } });
    fireEvent.submit(screen.getByPlaceholderText("Tulis komentar yang baik…").closest("form")!);
    await waitFor(() => expect(mockShowSuccessDialog).toHaveBeenCalledWith("Komentar berhasil dikirim."));
  });

  it("renders profile page and users page with input changes", async () => {
    mockState = {
      users: { profile, isChangeProfile: false, isChangeProfilePhoto: false, isChangeProfilePassword: false },
    };
    render(<ProfilePage />);
    fireEvent.change(screen.getByDisplayValue("Ayu"), { target: { value: "Ayu Baru" } });
    fireEvent.click(screen.getByRole("button", { name: /Simpan perubahan/i }));
    await waitFor(() => expect(mockShowSuccessDialog).toHaveBeenCalledWith("Informasi profil berhasil disimpan."));

    mockState = {
      users: { users: [{ id: 1, name: "Rina", email: "rina@test.com", created_at: "2024-01-01T00:00:00.000Z" }], isUsers: false },
    };
    render(<UsersPage />);
    fireEvent.change(screen.getByLabelText(/Cari anggota berdasarkan nama atau email/i), { target: { value: "rina" } });
    expect(screen.getByText("Rina")).toBeInTheDocument();
  });

  it("covers profile loading, photo upload, password validations, and API failures", async () => {
    mockState = { users: { profile: null } };
    const { rerender } = render(<ProfilePage />);
    expect(screen.getByText("Memuat profil…")).toBeInTheDocument();

    mockState = { users: { profile: { ...profile, photo: "https://example.com/profile.png" }, isChangeProfile: false, isChangeProfilePhoto: false, isChangeProfilePassword: false } };
    rerender(<ProfilePage />);
    expect(screen.getByAltText("Foto profil")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Pilih foto baru/i), { target: { files: [] } });

    fireEvent.change(screen.getByLabelText(/Kata sandi baru/i), { target: { value: "short" } });
    fireEvent.change(screen.getByLabelText(/Konfirmasi kata sandi/i), { target: { value: "short" } });
    fireEvent.submit(screen.getByRole("button", { name: /Ubah kata sandi/i }).closest("form")!);
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledWith("Kata sandi baru minimal 6 karakter."));

    fireEvent.change(screen.getByLabelText(/Kata sandi baru/i), { target: { value: "secret123" } });
    fireEvent.change(screen.getByLabelText(/Konfirmasi kata sandi/i), { target: { value: "different" } });
    fireEvent.submit(screen.getByRole("button", { name: /Ubah kata sandi/i }).closest("form")!);
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledWith("Konfirmasi kata sandi belum cocok."));

    mockDispatch.mockImplementation(() => ({ unwrap: async () => { throw new Error("update failed"); } }));
    fireEvent.change(screen.getByLabelText(/Nama lengkap/i), { target: { value: "Ayu Baru" } });
    fireEvent.click(screen.getByRole("button", { name: /Simpan perubahan/i }));
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledWith("Error: update failed"));

    fireEvent.change(screen.getByLabelText(/Pilih foto baru/i), { target: { files: [new File(["photo"], "new.png", { type: "image/png" })] } });
    fireEvent.click(screen.getByRole("button", { name: "Unggah foto" }));
    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledTimes(4));
  });

  it("successfully uploads a profile photo and updates a password", async () => {
    mockState = { users: { profile, isChangeProfile: false, isChangeProfilePhoto: false, isChangeProfilePassword: false } };
    mockDispatch.mockImplementation(() => ({ unwrap: async () => undefined }));
    render(<ProfilePage />);

    fireEvent.change(screen.getByLabelText(/Pilih foto baru/i), { target: { files: [new File(["photo"], "profile.png", { type: "image/png" })] } });
    fireEvent.click(screen.getByRole("button", { name: "Unggah foto" }));
    await waitFor(() => expect(mockShowSuccessDialog).toHaveBeenCalledWith("Foto profil berhasil diperbarui."));
    expect(screen.getByText("Pilih foto baru")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Kata sandi saat ini/i), { target: { value: "old-password" } });
    fireEvent.change(screen.getByLabelText(/Kata sandi baru/i), { target: { value: "new-password" } });
    fireEvent.change(screen.getByLabelText(/Konfirmasi kata sandi/i), { target: { value: "new-password" } });
    fireEvent.submit(screen.getByRole("button", { name: /Ubah kata sandi/i }).closest("form")!);
    await waitFor(() => expect(mockShowSuccessDialog).toHaveBeenCalledWith("Kata sandi berhasil diperbarui."));
  });

  it("renders the busy labels for profile mutations", () => {
    mockState = { users: { profile, isChangeProfile: true, isChangeProfilePhoto: true, isChangeProfilePassword: true } };
    render(<ProfilePage />);

    expect(screen.getByRole("button", { name: /Menyimpan…/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Memperbarui…/i })).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/Pilih foto baru/i), { target: { files: [new File(["photo"], "profile.png", { type: "image/png" })] } });
    expect(screen.getByRole("button", { name: /Mengunggah…/i })).toBeDisabled();
  });

  it("covers users loading, empty filtering, and optional user photos", () => {
    mockState = { users: { users: [], isUsers: true } };
    const { rerender } = render(<UsersPage />);
    expect(screen.getByText("Memuat anggota…")).toBeInTheDocument();

    mockState = { users: { users: [], isUsers: false } };
    rerender(<UsersPage />);
    expect(screen.getByText("Tidak ada anggota yang cocok dengan pencarianmu.")).toBeInTheDocument();

    mockState = {
      users: {
        users: [{ id: 2, name: "Rina", email: "rina@example.com", photo: "https://example.com/rina.png", created_at: "2024-01-01" }],
        isUsers: false,
      },
    };
    rerender(<UsersPage />);
    expect(screen.getByAltText("")).toHaveAttribute("src", "https://example.com/rina.png");
  });

  it("reports user-list request errors", async () => {
    mockState = { users: { users: [], isUsers: false } };
    mockDispatch.mockImplementation(() => ({ unwrap: async () => { throw new Error("users unavailable"); } }));
    render(<UsersPage />);

    await waitFor(() => expect(mockShowErrorDialog).toHaveBeenCalledWith("Error: users unavailable"));
  });
});
