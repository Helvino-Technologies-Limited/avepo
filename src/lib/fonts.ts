export const FONT_STACKS = {
  sans: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  classic: "'Trebuchet MS', Verdana, sans-serif",
} as const;

export type FontFamilyKey = keyof typeof FONT_STACKS;

export const FONT_OPTIONS: { value: FontFamilyKey; label: string }[] = [
  { value: "sans", label: "Modern Sans (default)" },
  { value: "serif", label: "Classic Serif" },
  { value: "classic", label: "Traditional Sans" },
];
