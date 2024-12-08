"use client";

import { useState, useEffect } from "react";

export const useAccessTodoStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>(result);

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};
