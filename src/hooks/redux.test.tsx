import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAppDispatch, useAppSelector } from "./redux";
import { store } from "@/store";

function HookConsumer() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => Boolean(state.auth.user));

  return (
    <button onClick={() => dispatch({ type: "test/action" })}>
      {isLoggedIn ? "authenticated" : "anonymous"}
    </button>
  );
}

describe("typed Redux hooks", () => {
  it("selects state and dispatches through the configured store", () => {
    render(
      <Provider store={store}>
        <HookConsumer />
      </Provider>,
    );

    expect(screen.getByRole("button", { name: "anonymous" })).toBeInTheDocument();
    screen.getByRole("button").click();
    expect(screen.getByRole("button", { name: "anonymous" })).toBeInTheDocument();
  });
});
