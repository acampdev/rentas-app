import { Box, Paper, Tab, Tabs } from "@mui/material";
import ActualizarTim from "../tim/ActulizarTim";
import { TimFormTab } from "./registroTim/TimFormTab";
import { TimSearchTab } from "./registroTim/TimSearchTab";
import { TimTabPanel } from "./registroTim/TimTabPanel";
import { useRegistroTim } from "./registroTim/useRegistroTim";

export const RegistroTIM = () => {
  const tim = useRegistroTim();
  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 900, borderRadius: 2, overflow: "hidden" }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tim.tab}
          onChange={(_, value: number) => tim.setTab(value)}
        >
          <Tab label="Formulario TIM" />
          <Tab label="Búsqueda TIM" />
        </Tabs>
      </Box>
      <TimTabPanel value={tim.tab} index={0}>
        <TimFormTab
          form={tim.form}
          setForm={tim.setForm}
          options={tim.options}
          loadingTributes={tim.loadingTributes}
          saving={tim.isCreating}
          onReset={tim.reset}
          onSave={() => void tim.save()}
        />
      </TimTabPanel>
      <TimTabPanel value={tim.tab} index={1}>
        <TimSearchTab
          filters={tim.filters}
          setFilters={tim.setFilters}
          options={tim.options}
          loadingTributes={tim.loadingTributes}
          search={tim.search}
          deleting={tim.isDeleting}
          onSearch={() => void tim.find()}
          onEdit={tim.edit}
          onDelete={(record) => void tim.remove(record)}
        />
      </TimTabPanel>
      <ActualizarTim
        open={tim.editOpen}
        onClose={() => tim.setEditOpen(false)}
        timData={tim.selectedTim}
        onSuccess={() => void tim.find()}
      />
    </Paper>
  );
};

export default RegistroTIM;
