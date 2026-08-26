// src/components/reportes/modal/PrintPU.tsx
import { Dialog, DialogContent } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { PrintPUFooter, PrintPUHeader } from "./printPU/PrintPUControls";
import { PrintPUDocument } from "./printPU/PrintPUDocument";
import { PrintPUSelector } from "./printPU/PrintPUSelector";
import type { PrintPageSize, PrintPUProps } from "./printPU/printPU.types";
import { createPrintPUStyles, currentPUDate } from "./printPU/printPU.utils";

export type { PrintPUProps } from "./printPU/printPU.types";

export const PrintPU = ({
  isOpen,
  onClose,
  contribuyente,
  puData = [],
}: PrintPUProps) => {
  const [pageSize, setPageSize] = useState<PrintPageSize>("A4");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activePu = puData[selectedIndex] ?? puData[0] ?? null;
  const date = useMemo(currentPUDate, []);

  useEffect(() => {
    if (isOpen) setSelectedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    if (selectedIndex >= puData.length) setSelectedIndex(0);
  }, [puData.length, selectedIndex]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxHeight: "92vh", borderRadius: 3 } }}
    >
      <style>{createPrintPUStyles(pageSize)}</style>
      <PrintPUHeader
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onPrint={() => window.print()}
        onClose={onClose}
      />
      <DialogContent sx={{ p: 3, bgcolor: "#f8fafc" }}>
        <PrintPUSelector
          items={puData}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
        <PrintPUDocument
          pageSize={pageSize}
          date={date}
          contribuyente={contribuyente}
          pu={activePu}
        />
      </DialogContent>
      <PrintPUFooter onPrint={() => window.print()} onClose={onClose} />
    </Dialog>
  );
};

export default PrintPU;
