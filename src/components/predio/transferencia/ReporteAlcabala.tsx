import { Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { es } from "date-fns/locale";
import SelectorPredio from "../../modal/SelectorPredio";
import { ReporteAlcabalaFilters } from "./reporteAlcabala/ReporteAlcabalaFilters";
import { ReporteAlcabalaPreview } from "./reporteAlcabala/ReporteAlcabalaPreview";
import { useReporteAlcabala } from "./reporteAlcabala/useReporteAlcabala";

const ReporteAlcabala = () => {
  const report = useReporteAlcabala();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        <ReporteAlcabalaFilters
          filters={report.filters}
          setFilters={report.setFilters}
          onOpenPredio={() => report.setSelectorOpen(true)}
          onReset={report.reset}
          onSearch={report.search}
          onPrint={report.print}
        />
        <ReporteAlcabalaPreview
          hasSearched={report.hasSearched}
          results={report.results}
        />
        <SelectorPredio
          isOpen={report.selectorOpen}
          onClose={() => report.setSelectorOpen(false)}
          onSelectPredio={report.selectPredio}
          title="Seleccionar Predio"
        />
      </Box>
    </LocalizationProvider>
  );
};

export default ReporteAlcabala;
