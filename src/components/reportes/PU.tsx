import { Box, Paper } from "@mui/material";
import SelectorContribuyente from "../modal/SelectorContribuyente";
import PrintPU from "./modal/PrintPU";
import { PUFilters } from "./pu/PUFilters";
import { PUHeader } from "./pu/PUHeader";
import { PUTable } from "./pu/PUTable";
import { usePUView } from "./pu/usePUView";

export default function PU() {
  const view = usePUView();

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
          mb: 3,
        }}
      >
        <PUHeader />
        <Box sx={{ p: 3 }}>
          <PUFilters
            contributor={view.contributor}
            propertyCode={view.propertyCode}
            loading={view.loading}
            canPrint={view.results.length > 0}
            onPropertyCodeChange={view.setPropertyCode}
            onSelectContributor={() => view.setSelectorOpen(true)}
            onSearch={view.search}
            onPrint={() => view.setPrintOpen(true)}
          />
          <PUTable data={view.results} loading={view.loading} />
        </Box>
      </Paper>

      <SelectorContribuyente
        isOpen={view.selectorOpen}
        onClose={() => view.setSelectorOpen(false)}
        onSelectContribuyente={view.selectContributor}
        title="Buscar Contribuyente"
        selectedId={view.contributor?.codigo}
      />
      <PrintPU
        isOpen={view.printOpen}
        onClose={() => view.setPrintOpen(false)}
        contribuyente={view.contributor}
        puData={view.results}
      />
    </Box>
  );
}
