import { describe, expect, it } from "vitest";
import { store } from "./store";

describe("store", () => {
  it("combines auth, user, and post state", () => {
    expect(Object.keys(store.getState())).toEqual(["auth", "users", "posts"]);
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().users.users).toEqual([]);
    expect(store.getState().posts.posts).toEqual([]);
  });
});
