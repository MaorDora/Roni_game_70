import type { CSSProperties } from "react";

/**
 * OKLCH → sRGB hex. Colours are computed here (not with CSS `oklch(var(--h))`)
 * so every browser, including older iPhones, gets plain hex values.
 */
export function oklch(l: number, c: number, hueDeg: number, alpha = 1): string {
  const h = (hueDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const linear = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_
  ];

  const channels = linear.map((v) => {
    const srgb = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, srgb)) * 255);
  });
  if (alpha < 1) channels.push(Math.round(alpha * 255));

  return "#" + channels.map((n) => n.toString(16).padStart(2, "0")).join("");
}

/** One hue per category; identical lightness & chroma keep the board colourful but orderly. */
export const catStyle = (hue: number) =>
  ({
    "--cat-fill": oklch(0.885, 0.075, hue),
    "--cat-fill-2": oklch(0.845, 0.095, hue),
    "--cat-soft": oklch(0.97, 0.022, hue),
    "--cat-line": oklch(0.8, 0.09, hue),
    "--cat-accent": oklch(0.58, 0.15, hue),
    "--cat-ink": oklch(0.33, 0.08, hue),
    "--cat-shadow": oklch(0.45, 0.12, hue, 0.45)
  }) as CSSProperties;
