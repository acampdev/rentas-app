import { Person, PersonAdd } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import { ContribuyenteConsultaFilters } from "./ContribuyenteConsultaFilters";
import { ContribuyenteConsultaResults } from "./ContribuyenteConsultaResults";
import type { ContribuyenteConsultaProps } from "./contribuyenteConsulta.types";
import { useContribuyenteConsultaView } from "./useContribuyenteConsultaView";

export type {
  Contribuyente,
  ContribuyenteConsultaFiltro,
  ContribuyenteConsultaProps,
} from "./contribuyenteConsulta.types";

const ContribuyenteConsulta = ({
  contribuyentes,
  onBuscar,
  onNuevo,
  onEditar,
  loading = false,
}: ContribuyenteConsultaProps) => {
  const controller = useContribuyenteConsultaView(contribuyentes, onBuscar);
  return (
    <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={2}
        sx={{ borderRadius: 2, border: 1, borderColor: "divider", mb: 3 }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Consulta de Contribuyentes
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Busca y gestiona la información de contribuyentes registrados
              </Typography>
            </Box>
          </Box>
          {onNuevo && (
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={onNuevo}
            >
              Nuevo Contribuyente
            </Button>
          )}
        </Box>
      </Paper>
      <Stack spacing={3}>
        <Paper
          elevation={2}
          sx={{ borderRadius: 2, border: 1, borderColor: "divider" }}
        >
          <Box sx={{ p: 3 }}>
            <ContribuyenteConsultaFilters
              filters={controller.filters}
              types={controller.contributorTypes}
              onChange={controller.updateFilter}
              onToggle={controller.toggleFilter}
              onSearch={controller.search}
              onClear={controller.clear}
            />
            <ContribuyenteConsultaResults
              rows={controller.visibleRows}
              loading={loading}
              onEdit={onEditar}
            />
            {!loading && contribuyentes.length > 0 && (
              <TablePagination
                component="div"
                count={contribuyentes.length}
                rowsPerPage={controller.rowsPerPage}
                page={controller.page}
                onPageChange={(_, page) => controller.setPage(page)}
                onRowsPerPageChange={controller.changeRowsPerPage}
                rowsPerPageOptions={[6, 12, 24]}
              />
            )}
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ContribuyenteConsulta;
