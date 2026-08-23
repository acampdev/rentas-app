import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Alert, Autocomplete, Box, Button, Card, CardContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import type { OptionFormat } from "../../../hooks/useConstantesOptions";
import type { CategoriaSeleccionada } from "./registrosPisos.types";

interface Props {
  parent: OptionFormat | null;
  child: OptionFormat | null;
  letter: OptionFormat | null;
  parents: OptionFormat[];
  children: OptionFormat[];
  letters: OptionFormat[];
  categories: CategoriaSeleccionada[];
  total: number;
  error?: string;
  catalogError?: string | null;
  onParentChange: (value: OptionFormat | null) => void;
  onChildChange: (value: OptionFormat | null) => void;
  onLetterChange: (value: OptionFormat | null) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const optionProps = {
  getOptionLabel: (item: OptionFormat) => item.label,
  isOptionEqualToValue: (a: OptionFormat, b: OptionFormat) => String(a.value) === String(b.value),
};

export const PisoCategoriasSection = ({ parent, child, letter, parents, children, letters, categories, total, error, catalogError, onParentChange, onChildChange, onLetterChange, onAdd, onRemove }: Props) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" fontWeight={700} mb={2}>Categorías del piso</Typography>
      {catalogError && <Alert severity="warning" sx={{ mb: 2 }}>{catalogError}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(180px, 1fr)) auto" }, gap: 2, alignItems: "start" }}>
        <Autocomplete {...optionProps} options={parents} value={parent} onChange={(_, value) => onParentChange(value)} renderInput={(params) => <TextField {...params} size="small" label="Categoría" />} />
        <Autocomplete {...optionProps} options={children} value={child} disabled={!parent} onChange={(_, value) => onChildChange(value)} renderInput={(params) => <TextField {...params} size="small" label="Subcategoría" />} />
        <Autocomplete {...optionProps} options={letters} value={letter} disabled={!child} onChange={(_, value) => onLetterChange(value)} renderInput={(params) => <TextField {...params} size="small" label="Letra" />} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd} sx={{ height: 40 }}>Agregar</Button>
      </Box>
      <TableContainer sx={{ mt: 2, maxHeight: 340 }}>
        <Table stickyHeader size="small">
          <TableHead><TableRow><TableCell>#</TableCell><TableCell>Categoría</TableCell><TableCell>Subcategoría</TableCell><TableCell>Letra</TableCell><TableCell align="right">Valor (S/)</TableCell><TableCell align="center">Acciones</TableCell></TableRow></TableHead>
          <TableBody>
            {categories.map((item, index) => (
              <TableRow key={item.id} hover><TableCell>{index + 1}</TableCell><TableCell>{item.padre.label}</TableCell><TableCell>{item.hijo.label}</TableCell><TableCell>{item.letra.label}</TableCell><TableCell align="right">{item.valor.toFixed(2)}</TableCell><TableCell align="center"><IconButton color="error" size="small" aria-label={`Quitar ${item.hijo.label}`} onClick={() => onRemove(item.id)}><DeleteOutlineIcon fontSize="small" /></IconButton></TableCell></TableRow>
            ))}
            {!categories.length && <TableRow><TableCell colSpan={6} align="center">No hay categorías seleccionadas</TableCell></TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography align="right" fontWeight={700} mt={2}>Total valor unitario: S/ {total.toFixed(2)}</Typography>
    </CardContent>
  </Card>
);
