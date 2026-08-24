import { Box } from '@mui/material';
import type { ReactNode } from 'react';

export const TabPanel = ({ value, index, children }: { value: number; index: number; children: ReactNode }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);
