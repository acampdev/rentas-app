// src/components/persona/PersonaList.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Search as SearchIcon } from "@mui/icons-material";
import { useTipoDocumentoOptions } from "../../hooks/useConstantesOptions";
import type { PersonaData } from "../../services/personaService";

interface PersonaListProps {
  personas: PersonaData[];
  loading: boolean;
  onBuscar: (codTipoDocumento: string, documento: string) => void;
  onEditar: (persona: PersonaData) => void;
}

const PersonaList: React.FC<PersonaListProps> = ({
  personas,
  loading,
  onBuscar,
  onEditar,
}) => {
  const [codTipoDocumento, setCodTipoDocumento] = useState("4101");
  const [documento, setDocumento] = useState("");
  const { options: tiposDocumento, loading: loadingTiposDocumento } =
    useTipoDocumentoOptions();

  const tipoDocumentoSeleccionado = tiposDocumento.some(
    (option) => String(option.value) === codTipoDocumento,
  )
    ? codTipoDocumento
    : "";

  const buscar = () => {
    onBuscar(codTipoDocumento, documento.trim());
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <FormControl sx={{ minWidth: 240 }} disabled={loadingTiposDocumento}>
          <InputLabel id="persona-tipo-documento-label">
            Tipo de documento
          </InputLabel>
          <Select
            labelId="persona-tipo-documento-label"
            label="Tipo de documento"
            value={tipoDocumentoSeleccionado}
            onChange={(event) => setCodTipoDocumento(event.target.value)}
          >
            {tiposDocumento.map((option) => (
              <MenuItem key={option.value} value={String(option.value)}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="N.º Documento"
          value={documento}
          onChange={(event) => setDocumento(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              buscar();
            }
          }}
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          onClick={buscar}
          disabled={
            loading ||
            loadingTiposDocumento ||
            !codTipoDocumento ||
            !documento.trim()
          }
        >
          Buscar
        </Button>
      </Box>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 780 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>CÓDIGO</TableCell>
              <TableCell>DOCUMENTO</TableCell>
              <TableCell>PERSONA</TableCell>
              <TableCell>TIPO</TableCell>
              <TableCell>TELÉFONO</TableCell>
              <TableCell align="center">ACCIONES</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {personas.map((persona) => {
              const nombreCompleto =
                persona.nombrePersona ||
                [
                  persona.apellidopaterno,
                  persona.apellidomaterno,
                  persona.nombres,
                ]
                  .filter(Boolean)
                  .join(" ");

              return (
                <TableRow key={persona.codPersona} hover>
                  <TableCell>{persona.codPersona}</TableCell>
                  <TableCell>{persona.numerodocumento}</TableCell>
                  <TableCell>{nombreCompleto}</TableCell>
                  <TableCell>
                    {persona.codTipopersona === "0302" ? "Jurídica" : "Natural"}
                  </TableCell>
                  <TableCell>{persona.telefono || "-"}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar persona">
                      <IconButton
                        color="primary"
                        onClick={() => onEditar(persona)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && personas.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          Ingrese un documento para consultar personas.
        </Typography>
      )}
    </Paper>
  );
};

export default PersonaList;
