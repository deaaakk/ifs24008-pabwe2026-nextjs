import { apiRequest } from "@/helpers/apiHelper";
import type { Post } from "@/types";

export const getPosts = (isMe = false) =>
  apiRequest<{ posts: Post[] }>("/posts", {
    query: isMe ? { is_me: 1 } : undefined,
  });

export const getPost = (id: number | string) =>
  apiRequest<{ post: Post }>(`/posts/${id}`);

export const addPost = (description: string) =>
  apiRequest<{ post_id: number }>("/posts", {
    method: "POST",
    body: { description },
  });

export const updatePost = (id: number, description: string) =>
  apiRequest<never>(`/posts/${id}`, { method: "PUT", body: { description } });

export const updatePostCover = (id: number, cover: File) => {
  const body = new FormData();
  body.set("cover", cover);
  return apiRequest<never>(`/posts/${id}/cover`, { method: "POST", body });
};

export const deletePost = (id: number) =>
  apiRequest<never>(`/posts/${id}`, { method: "DELETE" });

export const togglePostLike = (id: number, like: boolean) =>
  apiRequest<never>(`/posts/${id}/likes`, {
    method: "POST",
    body: { like: like ? 1 : 0 },
  });

export const addComment = (id: number, comment: string) =>
  apiRequest<never>(`/posts/${id}/comments`, {
    method: "POST",
    body: { comment },
  });

export const deleteComment = (id: number) =>
  apiRequest<never>(`/posts/${id}/comments`, { method: "DELETE" });

export const deleteAllPosts = () =>
  apiRequest<never>("/posts", { method: "DELETE" });
