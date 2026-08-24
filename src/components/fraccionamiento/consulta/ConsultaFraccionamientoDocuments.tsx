import { Button, Paper, Stack } from "@mui/material";
import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";
import type { Fraccionamiento } from "../../../types/fraccionamiento.types";
import ConvenioDeuda from "../modal/ConvenioDeuda";
import EstadoCuenta from "../modal/EstadoCuenta";
import EstadoDeuda from "../modal/EstadoDeuda";
import ResolucionJefatural from "../modal/ResolucionJefatural";
import {
  DOCUMENTOS_FRACCIONAMIENTO,
  type DocumentoFraccionamiento,
} from "./consultaFraccionamiento.types";

interface Props {
  openDocument: DocumentoFraccionamiento | null;
  selected: Fraccionamiento | null;
  contribuyente: ContribuyenteListItem | null;
  onOpen: (document: DocumentoFraccionamiento) => void;
  onClose: () => void;
}

export const ConsultaFraccionamientoDocuments = ({
  openDocument,
  selected,
  contribuyente,
  onOpen,
  onClose,
}: Props) => (
  <>
    <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
      <Stack direction="row" spacing={2} sx={{ overflowX: "auto" }}>
        {DOCUMENTOS_FRACCIONAMIENTO.map(({ tipo, etiqueta }) => (
          <Button
            key={tipo}
            variant="outlined"
            onClick={() => onOpen(tipo)}
            sx={{
              flex: "1 0 0",
              minWidth: 180,
              height: 40,
              whiteSpace: "nowrap",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {etiqueta}
          </Button>
        ))}
      </Stack>
    </Paper>
    <ConvenioDeuda
      open={openDocument === "convenio"}
      onClose={onClose}
      fraccionamiento={selected}
      contribuyente={contribuyente}
    />
    <EstadoCuenta
      open={openDocument === "estadoCuenta"}
      onClose={onClose}
      fraccionamiento={selected}
      contribuyente={contribuyente}
    />
    <ResolucionJefatural
      open={openDocument === "resolucionJefatural"}
      onClose={onClose}
      fraccionamiento={selected}
      contribuyente={contribuyente}
    />
    <EstadoDeuda
      open={openDocument === "estadoDeuda"}
      onClose={onClose}
      fraccionamiento={selected}
      contribuyente={contribuyente}
    />
  </>
);
