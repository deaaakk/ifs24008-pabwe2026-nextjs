import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "@/helpers/apiHelper";
import {
  addComment,
  addPost,
  deleteAllPosts,
  deleteComment,
  deletePost,
  getPost,
  getPosts,
  togglePostLike,
  updatePost,
  updatePostCover,
} from "./postApi";

vi.mock("@/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

describe("postApi", () => {
  beforeEach(() => vi.mocked(apiRequest).mockReset().mockResolvedValue({ status: "success", message: "ok", data: {} }));

  it("sends post reads and mutations to the documented endpoints", async () => {
    await getPosts();
    expect(apiRequest).toHaveBeenLastCalledWith("/posts", { query: undefined });
    await getPosts(true);
    expect(apiRequest).toHaveBeenLastCalledWith("/posts", { query: { is_me: 1 } });
    await getPost(9);
    expect(apiRequest).toHaveBeenLastCalledWith("/posts/9");
    await addPost("Hello");
    expect(apiRequest).toHaveBeenLastCalledWith("/posts", { method: "POST", body: { description: "Hello" } });
    await updatePost(9, "Updated");
    expect(apiRequest).toHaveBeenLastCalledWith("/posts/9", { method: "PUT", body: { description: "Updated" } });
    const cover = new File(["cover"], "cover.png", { type: "image/png" });
    await updatePostCover(9, cover);
    expect(vi.mocked(apiRequest).mock.calls.at(-1)?.[0]).toBe("/posts/9/cover");
    expect(vi.mocked(apiRequest).mock.calls.at(-1)?.[1]?.method).toBe("POST");
    await deletePost(9);
    expect(apiRequest).toHaveBeenLastCalledWith("/posts/9", { method: "DELETE" });
    await togglePostLike(9, true);
    expect(apiRequest).toHaveBeenLastCalledWith("/posts/9/likes", { method: "POST", body: { like: 1 } });
    await togglePostLike(9, false);
    expect(apiRequest).toHaveBeenLastCalledWith("/posts/9/likes", { method: "POST", body: { like: 0 } });
    await addComment(9, "Nice");
    expect(apiRequest).toHaveBeenLastCalledWith("/posts/9/comments", { method: "POST", body: { comment: "Nice" } });
    await deleteComment(9);
    expect(apiRequest).toHaveBeenLastCalledWith("/posts/9/comments", { method: "DELETE" });
    await deleteAllPosts();
    expect(apiRequest).toHaveBeenLastCalledWith("/posts", { method: "DELETE" });
  });
});
