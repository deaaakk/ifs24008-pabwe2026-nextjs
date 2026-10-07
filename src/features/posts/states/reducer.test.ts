import { describe, expect, it } from "vitest";
import type { Post } from "@/types";
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
import reducer, { resetPostMutationFlags, setPost, setPosts } from "./reducer";

const post: Post = {
  id: 7,
  user_id: 1,
  description: "A community story",
  created_at: "2026-01-01T00:00:00.000Z",
  author: { name: "Member" },
  likes: [],
  comments: [],
};

describe("posts reducer", () => {
  it("stores post collections and details", () => {
    expect(reducer(undefined, { type: "unknown" })).toMatchObject({ posts: [], post: null, isPost: false });
    expect(reducer(undefined, setPosts([post])).posts).toEqual([post]);
    expect(reducer(undefined, setPost(post)).post).toEqual(post);
    expect(reducer(undefined, setPost(null)).post).toBeNull();
  });

  it("tracks fetch requests and errors", () => {
    expect(reducer(undefined, fetchPosts.pending("1", false)).isPost).toBe(true);
    expect(reducer(undefined, fetchPosts.fulfilled([post], "2", false)).posts).toEqual([post]);
    expect(reducer(undefined, fetchPosts.rejected(new Error("list failed"), "3", false)).error).toBe("list failed");
    expect(reducer(undefined, fetchPost.pending("4", post.id)).isPost).toBe(true);
    expect(reducer(undefined, fetchPost.fulfilled(post, "5", post.id)).post).toEqual(post);
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), posts: [post] }, fetchPost.fulfilled(post, "5b", post.id)).posts).toEqual([post]);
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), posts: [post] }, fetchPost.fulfilled({ ...post, id: 8 }, "5b", 8)).posts).toEqual([post]);
    expect(reducer(undefined, fetchPost.rejected(new Error("detail failed"), "6", post.id)).error).toBe("detail failed");
    expect(reducer(undefined, fetchPosts.rejected(new Error("list failed"), "6b", false, "explicit")).error).toBe("explicit");
  });

  it("tracks all post mutations, updates stored posts, and resets completion flags", () => {
    const created = { ...post, id: 8 };
    expect(reducer(undefined, createPost.pending("7", post.description)).isPostAdd).toBe(true);
    expect(reducer(undefined, createPost.fulfilled(created, "8", post.description))).toMatchObject({
      isPostAdd: false,
      isPostAdded: true,
      posts: [created],
    });
    expect(reducer(undefined, createPost.rejected(new Error("add failed"), "9", post.description)).error).toBe("add failed");

    const edit = { id: post.id, description: "Updated" };
    const edited = { ...post, description: edit.description };
    expect(reducer(undefined, editPost.pending("10", edit)).isPostChange).toBe(true);
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), posts: [post] }, editPost.fulfilled(edited, "11", edit)).posts).toEqual([edited]);
    expect(reducer(undefined, editPost.rejected(new Error("edit failed"), "12", edit)).error).toBe("edit failed");
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), posts: [post] }, editPost.fulfilled({ ...edited, id: 99 }, "12b", edit)).posts).toEqual([post]);

    const cover = { id: post.id, cover: new File(["cover"], "cover.png", { type: "image/png" }) };
    expect(reducer(undefined, editPostCover.pending("13", cover)).isPostChangeCover).toBe(true);
    expect(reducer(undefined, editPostCover.fulfilled(edited, "14", cover)).isPostChangedCover).toBe(true);
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), posts: [post] }, editPostCover.fulfilled(edited, "14b", cover)).posts).toEqual([edited]);
    expect(reducer(undefined, editPostCover.rejected(new Error("cover failed"), "15", cover)).error).toBe("cover failed");
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), posts: [post] }, editPostCover.fulfilled({ ...edited, id: 99 }, "15b", cover)).posts).toEqual([post]);

    expect(reducer(undefined, removePost.pending("16", post.id)).isPostDelete).toBe(true);
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), posts: [post], post }, removePost.fulfilled(post.id, "17", post.id))).toMatchObject({
      isPostDeleted: true,
      posts: [],
      post: null,
    });
    expect(reducer(undefined, removePost.rejected(new Error("remove failed"), "18", post.id)).error).toBe("remove failed");
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), posts: [post], post: { ...post, id: 8 } }, removePost.fulfilled(post.id, "18b", post.id)).post).toEqual({ ...post, id: 8 });

    const like = { id: post.id, like: true };
    expect(reducer(undefined, changePostLike.pending("19", like)).isPostLike).toBe(true);
    expect(reducer(undefined, changePostLike.fulfilled(post, "20", like)).isPostLiked).toBe(true);
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), posts: [post] }, changePostLike.fulfilled(post, "20c", like)).posts).toEqual([post]);
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), posts: [created] }, changePostLike.fulfilled(post, "20b", like)).posts).toEqual([created]);
    expect(reducer(undefined, changePostLike.rejected(new Error("like failed"), "21", like)).error).toBe("like failed");

    const comment = { id: post.id, comment: "Nice!" };
    expect(reducer(undefined, createComment.pending("22", comment)).isPostAddComment).toBe(true);
    expect(reducer(undefined, createComment.fulfilled(post, "23", comment)).post).toEqual(post);
    expect(reducer(undefined, createComment.rejected(new Error("comment failed"), "24", comment)).error).toBe("comment failed");

    expect(reducer(undefined, removeComment.pending("25", post.id)).isPostDeleteComment).toBe(true);
    expect(reducer(undefined, removeComment.fulfilled(post, "26", post.id)).isPostDeletedComment).toBe(true);
    expect(reducer(undefined, removeComment.rejected(new Error("delete comment failed"), "27", post.id)).error).toBe("delete comment failed");

    expect(reducer(undefined, removeAllPosts.pending("28", undefined)).isPostDeleteAll).toBe(true);
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), posts: [post], post }, removeAllPosts.fulfilled("ok", "29", undefined))).toMatchObject({
      isPostDeletedAll: true,
      posts: [],
      post: null,
    });
    expect(reducer(undefined, removeAllPosts.rejected(new Error("clear failed"), "30", undefined)).error).toBe("clear failed");
    expect(reducer({
      ...reducer(undefined, { type: "unknown" }),
      isPostAdded: true,
      isPostChanged: true,
      isPostChangedCover: true,
      isPostDeleted: true,
      isPostLiked: true,
      isPostAddedComment: true,
      isPostDeletedComment: true,
      isPostDeletedAll: true,
    }, resetPostMutationFlags())).toMatchObject({
      isPostAdded: false,
      isPostChanged: false,
      isPostChangedCover: false,
      isPostDeleted: false,
      isPostLiked: false,
      isPostAddedComment: false,
      isPostDeletedComment: false,
      isPostDeletedAll: false,
    });
  });
});
