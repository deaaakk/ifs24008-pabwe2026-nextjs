import type { Post, User } from "./index";

export interface PostsPayload {
  posts: Post[];
}

export interface PostPayload {
  post: Post;
}

export interface UsersPayload {
  users: User[];
}

export interface UserPayload {
  user: User;
}
