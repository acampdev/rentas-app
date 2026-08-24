import { Box } from "@mui/material";
import { ConsultaTransferenciaFilters } from "./consultaTransferencia/ConsultaTransferenciaFilters";
import { ConsultaTransferenciaResults } from "./consultaTransferencia/ConsultaTransferenciaResults";
import type { ConsultaTransferenciaProps } from "./consultaTransferencia/consultaTransferencia.types";
import { useConsultaTransferencia } from "./consultaTransferencia/useConsultaTransferencia";

export const ConsultaTransferencia = ({
  onEditar,
}: ConsultaTransferenciaProps) => {
  const query = useConsultaTransferencia();
  return (
    <Box>
      <ConsultaTransferenciaFilters
        filters={query.filters}
        searching={query.isSearching}
        onChange={query.changeFilter}
        onSearch={() => void query.search()}
      />
      <ConsultaTransferenciaResults
        results={query.transferencias}
        onEdit={(transferencia) => onEditar?.(transferencia)}
      />
    </Box>
  );
};

export default ConsultaTransferencia;
