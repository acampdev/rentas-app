import { Delete, Edit } from "@mui/icons-material";
import {
  alpha,
  Box,
  Chip,
  IconButton,
  Stack,
  TableCell,
  Tooltip,
  useTheme,
} from "@mui/material";
import type { ValorUnitarioData } from "../../../services/valorUnitarioService";
import { costStyle } from "./valorUnitarioList.utils";

interface Props {
  value?: ValorUnitarioData;
  onSelect?: (value: ValorUnitarioData) => void;
  onDelete?: (id: string) => void;
}

export function ValorUnitarioCell({ value, onSelect, onDelete }: Props) {
  const theme = useTheme();
  const cost = value?.costo ?? 0;
  const style = costStyle(cost, Boolean(value));
  const content = (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Chip
        label={cost.toFixed(2)}
        sx={{
          ...style,
          fontWeight: value ? 700 : 500,
          borderRadius: "6px",
          height: 28,
          minWidth: 64,
          cursor: value ? "pointer" : "default",
        }}
      />
    </Box>
  );
  return (
    <TableCell align="center" sx={{ border: 1, borderColor: "divider", py: 1 }}>
      {value ? (
        <Tooltip
          enterDelay={200}
          componentsProps={{
            tooltip: {
              sx: { bgcolor: alpha(theme.palette.grey[900], 0.95), p: 0.5 },
            },
          }}
          title={
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                onClick={() => onSelect?.(value)}
                sx={{ bgcolor: "white", color: "primary.main" }}
              >
                <Edit fontSize="small" />
              </IconButton>
              {onDelete && (
                <IconButton
                  size="small"
                  onClick={() =>
                    window.confirm(
                      "¿Está seguro de eliminar este valor unitario?",
                    ) && onDelete(value.id)
                  }
                  sx={{ bgcolor: "white", color: "error.main" }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Stack>
          }
        >
          {content}
        </Tooltip>
      ) : (
        content
      )}
    </TableCell>
  );
}
