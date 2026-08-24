import { Box, Divider, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface SolicitudSectionProps {
  title: string;
  icon?: ReactNode;
  muted?: boolean;
  children: ReactNode;
}

export const SolicitudSection = ({ title, icon, muted = false, children }: SolicitudSectionProps) => (
  <Box>
    <Typography
      variant="subtitle1"
      color={muted ? 'text.secondary' : 'primary'}
      fontWeight={600}
      gutterBottom
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
    >
      {icon}{title}
    </Typography>
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);
