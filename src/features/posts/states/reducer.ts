import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
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

interface PostsState {
  posts: Post[];
  post: Post | null;
  isPost: boolean;
  isPostAdd: boolean;
  isPostAdded: boolean;
  isPostChange: boolean;
  isPostChanged: boolean;
  isPostChangeCover: boolean;
  isPostChangedCover: boolean;
  isPostDelete: boolean;
  isPostDeleted: boolean;
  isPostLike: boolean;
  isPostLiked: boolean;
  isPostAddComment: boolean;
  isPostAddedComment: boolean;
  isPostDeleteComment: boolean;
  isPostDeletedComment: boolean;
  isPostDeleteAll: boolean;
  isPostDeletedAll: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  post: null,
  isPost: false,
  isPostAdd: false,
  isPostAdded: false,
  isPostChange: false,
  isPostChanged: false,
  isPostChangeCover: false,
  isPostChangedCover: false,
  isPostDelete: false,
  isPostDeleted: false,
  isPostLike: false,
  isPostLiked: false,
  isPostAddComment: false,
  isPostAddedComment: false,
  isPostDeleteComment: false,
  isPostDeletedComment: false,
  isPostDeleteAll: false,
  isPostDeletedAll: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    setPost(state, action: PayloadAction<Post | null>) {
      state.post = action.payload;
    },
    resetPostMutationFlags(state) {
      state.isPostAdded = false;
      state.isPostChanged = false;
      state.isPostChangedCover = false;
      state.isPostDeleted = false;
      state.isPostLiked = false;
      state.isPostAddedComment = false;
      state.isPostDeletedComment = false;
      state.isPostDeletedAll = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isPost = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isPost = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isPost = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(fetchPost.pending, (state) => {
        state.isPost = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.isPost = false;
        state.post = action.payload;
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post,
        );
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.isPost = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(createPost.pending, (state) => {
        state.isPostAdd = true;
        state.isPostAdded = false;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isPostAdd = false;
        state.isPostAdded = true;
        state.post = action.payload;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isPostAdd = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(editPost.pending, (state) => {
        state.isPostChange = true;
        state.isPostChanged = false;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.isPostChange = false;
        state.isPostChanged = true;
        state.post = action.payload;
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post,
        );
      })
      .addCase(editPost.rejected, (state, action) => {
        state.isPostChange = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(editPostCover.pending, (state) => {
        state.isPostChangeCover = true;
        state.isPostChangedCover = false;
      })
      .addCase(editPostCover.fulfilled, (state, action) => {
        state.isPostChangeCover = false;
        state.isPostChangedCover = true;
        state.post = action.payload;
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post,
        );
      })
      .addCase(editPostCover.rejected, (state, action) => {
        state.isPostChangeCover = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(removePost.pending, (state) => {
        state.isPostDelete = true;
        state.isPostDeleted = false;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.isPostDelete = false;
        state.isPostDeleted = true;
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        if (state.post?.id === action.payload) state.post = null;
      })
      .addCase(removePost.rejected, (state, action) => {
        state.isPostDelete = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(changePostLike.pending, (state) => {
        state.isPostLike = true;
        state.isPostLiked = false;
      })
      .addCase(changePostLike.fulfilled, (state, action) => {
        state.isPostLike = false;
        state.isPostLiked = true;
        state.post = action.payload;
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post,
        );
      })
      .addCase(changePostLike.rejected, (state, action) => {
        state.isPostLike = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(createComment.pending, (state) => {
        state.isPostAddComment = true;
        state.isPostAddedComment = false;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isPostAddComment = false;
        state.isPostAddedComment = true;
        state.post = action.payload;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isPostAddComment = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(removeComment.pending, (state) => {
        state.isPostDeleteComment = true;
        state.isPostDeletedComment = false;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.isPostDeleteComment = false;
        state.isPostDeletedComment = true;
        state.post = action.payload;
      })
      .addCase(removeComment.rejected, (state, action) => {
        state.isPostDeleteComment = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(removeAllPosts.pending, (state) => {
        state.isPostDeleteAll = true;
        state.isPostDeletedAll = false;
      })
      .addCase(removeAllPosts.fulfilled, (state) => {
        state.isPostDeleteAll = false;
        state.isPostDeletedAll = true;
        state.posts = [];
        state.post = null;
      })
      .addCase(removeAllPosts.rejected, (state, action) => {
        state.isPostDeleteAll = false;
        state.error = String(action.payload ?? action.error.message);
      });
  },
});

export const { setPosts, setPost, resetPostMutationFlags } = postsSlice.actions;
export default postsSlice.reducer;
