import type { ThemeOptions } from "@mui/material/styles";
import { designTokens } from "../design-tokens";

export const customColors = {
  primary: designTokens.colors.primary,
  secondary: designTokens.colors.secondary,
  success: designTokens.colors.success,
  error: designTokens.colors.error,
  warning: designTokens.colors.warning,
  info: designTokens.colors.info,
};

export const themeFoundation: ThemeOptions = {
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    fontSize: 12,
    h1: { fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.2 },
    h2: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: "0.813rem", lineHeight: 1.5 },
    body2: { fontSize: "0.75rem", lineHeight: 1.5 },
    caption: { fontSize: "0.688rem", lineHeight: 1.4 },
    button: { textTransform: "none", fontWeight: 500, fontSize: "0.813rem" },
  },
  spacing: 6,
  shape: { borderRadius: 6 },
};
