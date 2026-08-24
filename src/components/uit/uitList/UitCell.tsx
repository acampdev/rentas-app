import { Box } from "@mui/material";

interface UitCellProps {
  children: React.ReactNode;
}

export const UitCell = ({ children }: UitCellProps) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="100%"
    width="100%"
  >
    {children}
  </Box>
);
