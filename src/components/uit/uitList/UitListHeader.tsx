import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";

export const UitListHeader = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        p: 3,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          <AccountBalanceIcon fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Valores UIT
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unidad Impositiva Tributaria - Histórico
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
