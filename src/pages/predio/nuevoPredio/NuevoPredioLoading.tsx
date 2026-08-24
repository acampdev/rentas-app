import { Box, CircularProgress, Container, Typography } from "@mui/material";
import MainLayout from "../../../layout/MainLayout";

export function NuevoPredioLoading() {
  return (
    <MainLayout title="Cargando Predio">
      <Container maxWidth="xl">
        <Box
          sx={{
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={48} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando datos del predio...
          </Typography>
        </Box>
      </Container>
    </MainLayout>
  );
}
