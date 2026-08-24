import { Chip, Paper, Typography } from "@mui/material";
import type { PrintablePUData } from "./printPU.types";

interface Props {
  items: PrintablePUData[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const PrintPUSelector = ({ items, selectedIndex, onSelect }: Props) =>
  items.length > 1 ? (
    <Paper
      elevation={0}
      className="no-print"
      sx={{
        p: 1.5,
        mb: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "#e2e8f0",
        borderRadius: 2,
      }}
    >
      <Typography variant="body2" fontWeight="bold">
        Seleccionar Predio ({items.length}):
      </Typography>
      {items.map((item, index) => (
        <Chip
          key={`${item.codPredio}-${index}`}
          label={`Predio: ${item.codPredio || index + 1}`}
          onClick={() => onSelect(index)}
          color={selectedIndex === index ? "success" : "default"}
          variant={selectedIndex === index ? "filled" : "outlined"}
          size="small"
          sx={{ cursor: "pointer", fontWeight: 600 }}
        />
      ))}
    </Paper>
  ) : null;
