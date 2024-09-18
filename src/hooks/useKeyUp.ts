import { useCallback, useEffect } from "react";

export const useKeyUp = (callback: () => void, keys: string[]) => {
  const onKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const wasAnyKeyPressed = keys.some((key) => event.key === key || event.code === key);

      if (wasAnyKeyPressed) {
        event.preventDefault();
        callback();
      }
    },
    [callback, keys],
  );

  useEffect(() => {
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeyUp]);
};
