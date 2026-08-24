import { Box } from "@mui/material";
import {
  PrintPUDocumentHeader,
  PrintPUIdentitySections,
} from "./PrintPUDocumentHeader";
import { PrintPUReferenceTable } from "./PrintPUReferenceTable";
import { PrintPUTerrainTotals, PrintPUValuation } from "./PrintPUValuation";
import type {
  PrintablePUData,
  PrintPageSize,
  PrintPUContribuyente,
} from "./printPU.types";

interface Props {
  pageSize: PrintPageSize;
  date: string;
  contribuyente: PrintPUContribuyente | null;
  pu: PrintablePUData | null;
}

export const PrintPUDocument = ({
  pageSize,
  date,
  contribuyente,
  pu,
}: Props) => (
  <Box
    id="printable-pu-document"
    sx={{
      width: pageSize === "A4" ? "210mm" : "216mm",
      minHeight: pageSize === "A4" ? "297mm" : "356mm",
      margin: "0 auto",
      bgcolor: "white",
      p: 2.5,
      border: "2px solid #166534",
      fontFamily: "Arial, sans-serif",
      color: "#14532d",
      boxSizing: "border-box",
    }}
  >
    <PrintPUDocumentHeader date={date} />
    <PrintPUIdentitySections contribuyente={contribuyente} pu={pu} />
    <PrintPUValuation pu={pu} />
    <PrintPUTerrainTotals pu={pu} />
    <PrintPUReferenceTable />
  </Box>
);
