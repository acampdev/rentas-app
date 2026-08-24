import { Box, Chip, Typography } from "@mui/material";

const items = [
  { label: "< 50", bgcolor: "#e6fcf5", color: "#0ca678", border: "#c3fae8" },
  { label: "50-100", bgcolor: "#fff4e6", color: "#d9480f", border: "#ffe8cc" },
  { label: "> 100", bgcolor: "#fff0f6", color: "#c2255c", border: "#ffdeeb" },
];

export function ValorUnitarioLegend() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "center",
        mt: 4,
        mb: 1,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontWeight: 700 }}
      >
        Leyenda de valores:
      </Typography>
      {items.map((item) => (
        <Chip
          key={item.label}
          label={item.label}
          sx={{
            bgcolor: item.bgcolor,
            color: item.color,
            fontWeight: 700,
            borderRadius: "6px",
            border: `1px solid ${item.border}`,
            height: 24,
          }}
        />
      ))}
    </Box>
  );
}
