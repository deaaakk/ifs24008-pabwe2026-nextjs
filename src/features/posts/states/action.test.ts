import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  addComment: vi.fn(),
  addPost: vi.fn(),
  deleteAllPosts: vi.fn(),
  deleteComment: vi.fn(),
  deletePost: vi.fn(),
  getPost: vi.fn(),
  getPosts: vi.fn(),
  togglePostLike: vi.fn(),
  updatePost: vi.fn(),
  updatePostCover: vi.fn(),
}));

vi.mock("../api/postApi", () => mocks);

import {
  changePostLike,
  createComment,
  createPost,
  editPost,
  editPostCover,
  fetchPost,
  fetchPosts,
  removeAllPosts,
  removeComment,
  removePost,
} from "./action";

const post = { id: 9, description: "test" };

const run = (thunk: ReturnType<typeof fetchPosts> | ReturnType<typeof fetchPost> | ReturnType<typeof createPost> | ReturnType<typeof editPost> | ReturnType<typeof editPostCover> | ReturnType<typeof removePost> | ReturnType<typeof changePostLike> | ReturnType<typeof createComment> | ReturnType<typeof removeComment> | ReturnType<typeof removeAllPosts>) =>
  thunk(vi.fn(), () => ({}), undefined);

describe("post async actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getPost.mockResolvedValue({ data: { post } });
  });

  it("fetches a post list and a post detail", async () => {
    mocks.getPosts.mockResolvedValue({ data: { posts: [post] } });
    const list = await run(fetchPosts(true));
    const detail = await run(fetchPost(9));

    expect(list.payload).toEqual([post]);
    expect(detail.payload).toEqual(post);
    expect(mocks.getPosts).toHaveBeenCalledWith(true);
    expect(mocks.getPost).toHaveBeenCalledWith(9);
  });

  it("creates, edits, and replaces a post cover", async () => {
    mocks.addPost.mockResolvedValue({ data: { post_id: 9 } });
    mocks.updatePost.mockResolvedValue(undefined);
    mocks.updatePostCover.mockResolvedValue(undefined);
    const cover = new File(["cover"], "cover.png", { type: "image/png" });

    const created = await run(createPost("new post"));
    const edited = await run(editPost({ id: 9, description: "updated" }));
    const coverUpdated = await run(editPostCover({ id: 9, cover }));

    expect(created.payload).toEqual(post);
    expect(edited.payload).toEqual(post);
    expect(coverUpdated.payload).toEqual(post);
    expect(mocks.addPost).toHaveBeenCalledWith("new post");
    expect(mocks.updatePost).toHaveBeenCalledWith(9, "updated");
    expect(mocks.updatePostCover).toHaveBeenCalledWith(9, cover);
  });

  it("changes likes and creates or removes comments", async () => {
    mocks.togglePostLike.mockResolvedValue(undefined);
    mocks.addComment.mockResolvedValue(undefined);
    mocks.deleteComment.mockResolvedValue(undefined);

    const liked = await run(changePostLike({ id: 9, like: true }));
    const commented = await run(createComment({ id: 9, comment: "nice" }));
    const commentRemoved = await run(removeComment(9));

    expect(liked.payload).toEqual(post);
    expect(commented.payload).toEqual(post);
    expect(commentRemoved.payload).toEqual(post);
    expect(mocks.togglePostLike).toHaveBeenCalledWith(9, true);
    expect(mocks.addComment).toHaveBeenCalledWith(9, "nice");
    expect(mocks.deleteComment).toHaveBeenCalledWith(9);
  });

  it("removes a post and all posts", async () => {
    mocks.deletePost.mockResolvedValue(undefined);
    mocks.deleteAllPosts.mockResolvedValue({ message: "deleted all" });

    const removed = await run(removePost(9));
    const allRemoved = await run(removeAllPosts());

    expect(removed.payload).toBe(9);
    expect(allRemoved.payload).toBe("deleted all");
  });

  it.each([
    ["fetchPosts", (error: unknown) => { mocks.getPosts.mockRejectedValue(error); return fetchPosts(false); }, "Gagal memuat postingan."],
    ["fetchPost", (error: unknown) => { mocks.getPost.mockRejectedValue(error); return fetchPost(9); }, "Gagal memuat postingan."],
    ["createPost", (error: unknown) => { mocks.addPost.mockRejectedValue(error); return createPost("x"); }, "Gagal membuat postingan."],
    ["editPost", (error: unknown) => { mocks.updatePost.mockRejectedValue(error); return editPost({ id: 9, description: "x" }); }, "Gagal mengubah postingan."],
    ["editPostCover", (error: unknown) => { mocks.updatePostCover.mockRejectedValue(error); return editPostCover({ id: 9, cover: new File([], "x.png") }); }, "Gagal mengganti cover."],
    ["removePost", (error: unknown) => { mocks.deletePost.mockRejectedValue(error); return removePost(9); }, "Gagal menghapus postingan."],
    ["changePostLike", (error: unknown) => { mocks.togglePostLike.mockRejectedValue(error); return changePostLike({ id: 9, like: true }); }, "Gagal mengubah like."],
    ["createComment", (error: unknown) => { mocks.addComment.mockRejectedValue(error); return createComment({ id: 9, comment: "x" }); }, "Gagal mengirim komentar."],
    ["removeComment", (error: unknown) => { mocks.deleteComment.mockRejectedValue(error); return removeComment(9); }, "Gagal menghapus komentar."],
    ["removeAllPosts", (error: unknown) => { mocks.deleteAllPosts.mockRejectedValue(error); return removeAllPosts(); }, "Gagal menghapus postingan."],
  ])("maps failures from %s to original or fallback messages", async (_name, createThunk, fallbackMessage) => {
    const errorResult = await run(createThunk(new Error("reported error")));
    expect(errorResult.meta.requestStatus).toBe("rejected");
    expect(errorResult.payload).toBe("reported error");

    vi.clearAllMocks();
    const fallbackResult = await run(createThunk("unexpected error"));
    expect(fallbackResult.meta.requestStatus).toBe("rejected");
    expect(fallbackResult.payload).toBe(fallbackMessage);
  });
});
