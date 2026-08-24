import {
  Avatar,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Close, Person } from "@mui/icons-material";

interface Props {
  title: string;
  onClose: () => void;
}

export const SelectorContribuyenteHeader = ({ title, onClose }: Props) => {
  const theme = useTheme();
  return (
    <DialogTitle
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: alpha(theme.palette.primary.main, 0.05),
        flexShrink: 0,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
          <Person />
        </Avatar>
        <Typography variant="h6" fontWeight={700} color="primary.dark">
          {title}
        </Typography>
      </Stack>
      <IconButton
        onClick={onClose}
        size="small"
        sx={{ color: "text.secondary" }}
        aria-label="Cerrar"
      >
        <Close />
      </IconButton>
    </DialogTitle>
  );
};
