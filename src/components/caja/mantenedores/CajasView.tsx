import { AppRegistration, FindInPage } from "@mui/icons-material";
import { alpha, Box, Paper, Stack, Tab, Tabs, useTheme } from "@mui/material";
import type { CajasController } from "./cajas.types";
import { CajasFilters } from "./cajasView/CajasFilters";
import { CajasRegistration } from "./cajasView/CajasRegistration";
import { CajasTable } from "./cajasView/CajasTable";
import { CajasTabPanel } from "./cajasView/CajasTabPanel";

export function CajasView({ controller }: { controller: CajasController }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        minWidth: 0,
        borderRadius: 2,
        overflow: "hidden",
        border: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={controller.tab}
          onChange={(_, value) => controller.setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab
            label="Registro Cajas"
            icon={<AppRegistration />}
            iconPosition="start"
          />
          <Tab
            label="Consulta Cajas"
            icon={<FindInPage />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
      <CajasTabPanel value={controller.tab} index={0}>
        <CajasRegistration controller={controller} />
      </CajasTabPanel>
      <CajasTabPanel value={controller.tab} index={1}>
        <Box sx={{ px: { xs: 0, sm: 0.5, md: 1 }, minWidth: 0 }}>
          <Stack spacing={3}>
            <CajasFilters controller={controller} />
            <CajasTable controller={controller} />
          </Stack>
        </Box>
      </CajasTabPanel>
    </Paper>
  );
}
