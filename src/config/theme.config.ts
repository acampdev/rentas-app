import { createTheme } from "@mui/material/styles";
import {
  componentOverrides,
  darkComponentOverrides,
} from "./theme/theme.components";
import { customColors, themeFoundation } from "./theme/theme.foundation";

export const lightTheme = createTheme({
  ...themeFoundation,
  components: componentOverrides,
  palette: {
    mode: "light",
    ...customColors,
    background: { default: "#F9FAFB", paper: "#FFFFFF" },
    text: { primary: "#111827", secondary: "#6B7280", disabled: "#9CA3AF" },
    divider: "#E5E7EB",
    action: {
      active: "#6B7280",
      hover: "rgba(0, 0, 0, 0.04)",
      selected: "rgba(0, 0, 0, 0.08)",
      disabled: "#9CA3AF",
      disabledBackground: "#F3F4F6",
    },
  },
});

export const darkTheme = createTheme({
  ...themeFoundation,
  components: darkComponentOverrides,
  palette: {
    mode: "dark",
    ...customColors,
    primary: {
      main: "#34D399",
      light: "#6EE7B7",
      dark: "#10B981",
      contrastText: "#000000",
    },
    secondary: {
      main: "#818CF8",
      light: "#A5B4FC",
      dark: "#6366F1",
      contrastText: "#000000",
    },
    background: { default: "#0F172A", paper: "#1E293B" },
    text: { primary: "#F9FAFB", secondary: "#D1D5DB", disabled: "#6B7280" },
    divider: "#334155",
    action: {
      active: "#D1D5DB",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "#6B7280",
      disabledBackground: "#1E293B",
    },
  },
});

export const getTheme = (mode: "light" | "dark") =>
  mode === "dark" ? darkTheme : lightTheme;
