export interface ApiResult<T> {
  status: "success" | "fail";
  message: string;
  data: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  photo?: string | null;
  bio?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface PostAuthor {
  name: string;
  photo?: string | null;
}

export interface PostComment {
  id: number;
  comment: string;
  created_at: string;
  updated_at?: string;
  user_id?: number;
  author?: PostAuthor;
}

export interface Post {
  id: number;
  user_id: number;
  cover?: string | null;
  description: string;
  created_at: string;
  updated_at?: string;
  author: PostAuthor;
  likes: number[];
  comments: Array<number | PostComment>;
  my_comment?: PostComment | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
}

export interface AuthUserData {
  user: User;
  token: string;
}
