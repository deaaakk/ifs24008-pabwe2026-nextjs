import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useInput } from "./useInput";

describe("useInput", () => {
  it("binds a value and updates it from input changes", () => {
    const { result } = renderHook(() => useInput("initial"));
    expect(result.current.value).toBe("initial");
    act(() => result.current.setValue("updated"));
    expect(result.current.value).toBe("updated");
    expect(typeof result.current.onChange).toBe("function");
  });
});
