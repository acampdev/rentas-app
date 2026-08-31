import { CallSplit, Home, NavigateNext } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Chip,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import SubdivicionForm from "../../../components/predio/subdivicion/SubdivicionForm";
import type { Predio } from "../../../models/Predio";
import MainLayout from "../../../layout/MainLayout";
import { useLocation } from "react-router-dom";

interface SubdivicionNavigationState {
  predioMatriz?: Predio;
}

const SubdivicionPage = () => {
  const location = useLocation();
  const navigationState = location.state as SubdivicionNavigationState | null;

  return (
    <MainLayout title="Subdivisión de Predio">
      <Container maxWidth="xl">
        <Box sx={{ py: 2 }}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
            <Chip icon={<Home />} label="Predio" size="small" variant="outlined" />
            <Chip icon={<CallSplit />} label="Subdivisión" size="small" color="primary" />
          </Breadcrumbs>
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={800} color="primary.main">
                Registro de subdivisión de predio
              </Typography>
              <Typography color="text.secondary">
                Seleccione el predio matriz y registre los datos resultantes de la subdivisión.
              </Typography>
            </Box>
            <SubdivicionForm initialPredio={navigationState?.predioMatriz} />
          </Paper>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default SubdivicionPage;
