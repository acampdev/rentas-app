import { Box, Paper, useTheme } from "@mui/material";
import SelectorContribuyente from "../modal/SelectorContribuyente";
import PrintHR from "./modal/PrintHR";
import { HRFilters } from "./hr/HRFilters";
import { HRHeader } from "./hr/HRHeader";
import { HRTable } from "./hr/HRTable";
import { useHRView } from "./hr/useHRView";

const HR = () => {
  const theme = useTheme();
  const view = useHRView();

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          mb: 3,
        }}
      >
        <HRHeader />
        <Box sx={{ p: 3 }}>
          <HRFilters
            contribuyente={view.contribuyente}
            loading={view.loading}
            canPrint={view.hrData.length > 0}
            onOpenSelector={() => view.setSelectorOpen(true)}
            onSearch={view.buscar}
            onPrint={() => view.setPrintOpen(true)}
          />
          <HRTable rows={view.hrData} loading={view.loading} />
        </Box>
      </Paper>
      <SelectorContribuyente
        isOpen={view.selectorOpen}
        onClose={() => view.setSelectorOpen(false)}
        onSelectContribuyente={view.selectContribuyente}
        title="Buscar Contribuyente"
        selectedId={
          typeof view.contribuyente?.codigo === "number"
            ? view.contribuyente.codigo
            : undefined
        }
      />
      <PrintHR
        isOpen={view.printOpen}
        onClose={() => view.setPrintOpen(false)}
        contribuyente={view.contribuyente}
        hrData={view.hrData}
      />
    </Box>
  );
};

export default HR;
