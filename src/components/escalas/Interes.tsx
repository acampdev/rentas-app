import { Save, Search } from "@mui/icons-material";
import { alpha, Box, Paper, Tab, Tabs, useTheme } from "@mui/material";
import { InteresConsulta } from "./interes/InteresConsulta";
import { InteresForm } from "./interes/InteresForm";
import { useInteresView } from "./interes/useInteresView";

export default function Interes() {
  const theme = useTheme();
  const view = useInteresView();
  const saving = view.isCreating || view.isUpdating;
  return (
    <Paper
      elevation={2}
      sx={{
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
        <Tabs value={view.tab} onChange={(_, value) => view.setTab(value)}>
          <Tab
            icon={<Search />}
            iconPosition="start"
            label="Consultar Interés"
          />
          <Tab
            icon={<Save />}
            iconPosition="start"
            label={view.editing ? "Modificar Interés" : "Registrar Interés"}
          />
        </Tabs>
      </Box>
      <Box hidden={view.tab !== 0} sx={{ py: 3 }}>
        <InteresConsulta
          items={view.intereses}
          year={view.anio}
          searchYear={view.searchYear}
          loading={view.loading}
          inactivating={view.isInactivating}
          error={view.error}
          onSearchYearChange={view.setSearchYear}
          onSearch={view.search}
          onEdit={view.edit}
          onInactivate={view.inactivate}
        />
      </Box>
      <Box hidden={view.tab !== 1} sx={{ py: 3 }}>
        <InteresForm
          form={view.form}
          editing={view.editing}
          saving={saving}
          invalid={view.formInvalid}
          onChange={view.updateForm}
          onReset={view.reset}
          onSave={view.save}
        />
      </Box>
    </Paper>
  );
}
