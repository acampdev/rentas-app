import { Box, Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledAperturaDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(2),
    minWidth: "500px",
    maxWidth: "600px",
    overflowX: "hidden",
  },
}));

export const AperturaHeader = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: "white",
  padding: theme.spacing(2),
  margin: theme.spacing(-3, -3, 2, -3),
  borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));
