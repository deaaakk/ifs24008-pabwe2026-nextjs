"use client";

import { useState, type ChangeEvent } from "react";

export function useInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setValue(event.currentTarget.value);

  const input = { value, onChange };
  Object.defineProperty(input, "setValue", {
    value: setValue,
    enumerable: false,
  });

  return input as typeof input & { setValue: typeof setValue };
}
