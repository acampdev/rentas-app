import { Box } from "@mui/material";
import type { ReactNode } from "react";

export function CajasTabPanel({
  children,
  index,
  value,
}: {
  children: ReactNode;
  index: number;
  value: number;
}) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>{children}</Box>
      )}
    </div>
  );
}
