import { Layers } from "@mui/icons-material";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { ConsultaPisosFilters } from "./consulta/ConsultaPisosFilters";
import { ConsultaPisosTable } from "./consulta/ConsultaPisosTable";
import { useConsultaPisos } from "./consulta/useConsultaPisos";

export default function ConsultaPisos() {
  const view = useConsultaPisos();
  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Layers color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h5" fontWeight={700}>
            Consulta de Pisos
          </Typography>
        </Stack>
        <ConsultaPisosFilters
          filters={view.uiFilters}
          loading={view.loading}
          onChange={view.setUiFilters}
          onSearch={view.search}
          onCreate={view.create}
          onClear={view.clear}
        />
      </Paper>
      <ConsultaPisosTable
        floors={view.pisos}
        loading={view.loading}
        editingFloor={view.editingFloor}
        onEdit={view.edit}
        onDelete={view.remove}
      />
    </Box>
  );
}
