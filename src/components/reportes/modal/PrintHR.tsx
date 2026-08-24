import { Print } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useMemo, useState } from "react";
import { PrintHRDocument } from "./printHR/PrintHRDocument";
import { PrintHRHeader } from "./printHR/PrintHRHeader";
import type { PrintHRProps, PrintPageSize } from "./printHR/printHR.types";
import { calculateHRTotals, getHRPrintStyles } from "./printHR/printHR.utils";

export type { PrintHRProps } from "./printHR/printHR.types";

export const PrintHR = ({
  isOpen,
  onClose,
  contribuyente,
  hrData = [],
}: PrintHRProps) => {
  const [pageSize, setPageSize] = useState<PrintPageSize>("A4");
  const totals = useMemo(() => calculateHRTotals(hrData), [hrData]);
  const handlePrint = () => window.print();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxHeight: "92vh", borderRadius: 3 } }}
    >
      <style>{getHRPrintStyles(pageSize)}</style>
      <PrintHRHeader
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onPrint={handlePrint}
        onClose={onClose}
      />
      <DialogContent sx={{ p: 3, bgcolor: "#f8fafc" }}>
        <PrintHRDocument
          pageSize={pageSize}
          contribuyente={contribuyente}
          rows={hrData}
          totals={totals}
        />
      </DialogContent>
      <DialogActions
        className="no-print"
        sx={{ p: 2, borderTop: "1px solid #e2e8f0" }}
      >
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cerrar
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          startIcon={<Print />}
          sx={{ bgcolor: "#ca8a04", "&:hover": { bgcolor: "#a16207" } }}
        >
          Imprimir Reporte HR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintHR;
