import {
  alpha,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import type { ValorUnitarioData } from "../../../services/valorUnitarioService";
import { ValorUnitarioCell } from "./ValorUnitarioCell";
import {
  findUnitValue,
  LETRAS,
  SUBCATEGORIAS,
} from "./valorUnitarioList.utils";

interface Props {
  values: ValorUnitarioData[];
  loading: boolean;
  onSelect?: (value: ValorUnitarioData) => void;
  onDelete?: (id: string) => void;
}

export function ValorUnitarioMatrix({
  values,
  loading,
  onSelect,
  onDelete,
}: Props) {
  const theme = useTheme();
  const headerSx = {
    fontWeight: 800,
    bgcolor: alpha(theme.palette.primary.main, 0.04),
    color: "primary.dark",
    border: 1,
    borderColor: "divider",
    py: 2,
    fontSize: "0.72rem",
  };
  return (
    <TableContainer
      sx={{
        opacity: loading ? 0.6 : 1,
        transition: "opacity 0.2s",
        overflowX: "auto",
      }}
    >
      <Table size="small" sx={{ borderCollapse: "collapse", minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={headerSx}>
              LETRAS
            </TableCell>
            {SUBCATEGORIAS.map((category) => (
              <TableCell
                key={category.cod}
                align="center"
                sx={{ ...headerSx, maxWidth: 130, whiteSpace: "normal" }}
              >
                {category.nombre}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {LETRAS.map((letter) => (
            <TableRow key={letter} hover>
              <TableCell
                align="center"
                sx={{ border: 1, borderColor: "divider", width: 80 }}
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Chip
                    label={letter}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: "#e6fcf5",
                      color: "#0ca678",
                      fontWeight: 800,
                      border: "1px solid #c3fae8",
                      "& .MuiChip-label": { px: 0 },
                    }}
                  />
                </Box>
              </TableCell>
              {SUBCATEGORIAS.map((category) => (
                <ValorUnitarioCell
                  key={category.cod}
                  value={findUnitValue(values, letter, category)}
                  onSelect={onSelect}
                  onDelete={onDelete}
                />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
