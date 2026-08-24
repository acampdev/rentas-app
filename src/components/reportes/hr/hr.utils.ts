import type { SxProps, Theme } from "@mui/material";

export const formatHRCurrency = (value: string | number) => {
  const number = typeof value === "string" ? Number.parseFloat(value) : value;
  return new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(number || 0);
};

export const getHRHeaderStyle = (theme: Theme): SxProps<Theme> => ({
  bgcolor: "#edf2fe",
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: 0.3,
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  py: 1.5,
  px: 1,
  whiteSpace: "nowrap",
});
