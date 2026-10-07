import { createAsyncThunk } from "@reduxjs/toolkit";
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
} from "../api/postApi";

export const fetchPosts = createAsyncThunk(
  "posts/list",
  async (isMe: boolean, { rejectWithValue }) => {
    try {
      return (await getPosts(isMe)).data.posts;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal memuat postingan.");
    }
  },
);

export const fetchPost = createAsyncThunk(
  "posts/detail",
  async (id: number, { rejectWithValue }) => {
    try {
      return (await getPost(id)).data.post;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal memuat postingan.");
    }
  },
);

export const createPost = createAsyncThunk(
  "posts/create",
  async (description: string, { rejectWithValue }) => {
    try {
      const result = await addPost(description);
      return (await getPost(result.data.post_id)).data.post;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal membuat postingan.");
    }
  },
);

export const editPost = createAsyncThunk(
  "posts/edit",
  async (payload: { id: number; description: string }, { rejectWithValue }) => {
    try {
      await updatePost(payload.id, payload.description);
      return (await getPost(payload.id)).data.post;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal mengubah postingan.");
    }
  },
);

export const editPostCover = createAsyncThunk(
  "posts/editCover",
  async (payload: { id: number; cover: File }, { rejectWithValue }) => {
    try {
      await updatePostCover(payload.id, payload.cover);
      return (await getPost(payload.id)).data.post;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal mengganti cover.");
    }
  },
);

export const removePost = createAsyncThunk(
  "posts/remove",
  async (id: number, { rejectWithValue }) => {
    try {
      await deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal menghapus postingan.");
    }
  },
);

export const changePostLike = createAsyncThunk(
  "posts/like",
  async (payload: { id: number; like: boolean }, { rejectWithValue }) => {
    try {
      await togglePostLike(payload.id, payload.like);
      return (await getPost(payload.id)).data.post;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal mengubah like.");
    }
  },
);

export const createComment = createAsyncThunk(
  "posts/comment",
  async (payload: { id: number; comment: string }, { rejectWithValue }) => {
    try {
      await addComment(payload.id, payload.comment);
      return (await getPost(payload.id)).data.post;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal mengirim komentar.");
    }
  },
);

export const removeComment = createAsyncThunk(
  "posts/removeComment",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteComment(id);
      return (await getPost(id)).data.post;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal menghapus komentar.");
    }
  },
);

export const removeAllPosts = createAsyncThunk(
  "posts/removeAll",
  async (_, { rejectWithValue }) => {
    try {
      return (await deleteAllPosts()).message;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal menghapus postingan.");
    }
  },
);
