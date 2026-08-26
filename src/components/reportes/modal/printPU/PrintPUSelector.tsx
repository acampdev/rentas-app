import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
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
        px: 1.5,
        pt: 1.25,
        mb: 2,
        bgcolor: "#f1f5f9",
        border: "1px solid #cbd5e1",
        borderRadius: 2,
      }}
    >
      <Typography variant="body2" fontWeight={700} sx={{ px: 0.5, mb: 0.5 }}>
        Predios urbanos encontrados: {items.length}
      </Typography>
      <Box sx={{ maxWidth: "100%" }}>
        <Tabs
          value={selectedIndex}
          onChange={(_event, value: number) => onSelect(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Predios urbanos para imprimir"
          sx={{
            minHeight: 42,
            "& .MuiTab-root": {
              minHeight: 42,
              minWidth: 120,
              fontWeight: 700,
              textTransform: "none",
            },
          }}
        >
          {items.map((item, index) => {
            const predio = item.codPredio?.trim();
            const piso = item.nivelPiso?.trim();
            const detalle = predio
              ? `Predio ${predio}`
              : piso
                ? `Piso ${piso}`
                : `Registro ${index + 1}`;

            return (
              <Tab
                key={`${predio || "pu"}-${piso || "sin-piso"}-${index}`}
                id={`print-pu-tab-${index}`}
                aria-controls="printable-pu-document"
                label={`PU ${index + 1} · ${detalle}`}
              />
            );
          })}
        </Tabs>
      </Box>
    </Paper>
  ) : null;
