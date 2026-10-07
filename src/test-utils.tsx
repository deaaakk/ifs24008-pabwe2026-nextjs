import { configureStore } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import authReducer from "@/features/auth/states/reducer";
import usersReducer from "@/features/users/states/reducer";
import postsReducer from "@/features/posts/states/reducer";

export function makeTestStore() {
  return configureStore({
    reducer: { auth: authReducer, users: usersReducer, posts: postsReducer },
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: Omit<RenderOptions, "wrapper"> = {},
) {
  const store = makeTestStore();
  return {
    store,
    ...render(ui, {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
      ...options,
    }),
  };
}
