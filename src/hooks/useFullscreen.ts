import { useCallback, useEffect, useState } from "react";

export function useFullscreen() {
  const [active, setActive] = useState(() => Boolean(document.fullscreenElement));

  useEffect(() => {
    const onChange = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  return { supported: document.fullscreenEnabled, active, toggle };
}
