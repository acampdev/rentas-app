import type { Components, Theme } from "@mui/material/styles";
import { customColors } from "./theme.foundation";

export const componentOverrides: Components<Theme> = {
  MuiButton: {
    defaultProps: { size: "small" },
    styleOverrides: {
      root: {
        borderRadius: 6,
        padding: "4px 12px",
        fontSize: "0.75rem",
        fontWeight: 500,
        boxShadow: "none",
        minHeight: 32,
        "&:hover": { boxShadow: "none" },
      },
      sizeSmall: { padding: "3px 10px", fontSize: "0.688rem", minHeight: 28 },
      sizeMedium: { padding: "5px 14px", fontSize: "0.75rem", minHeight: 32 },
      sizeLarge: { padding: "6px 16px", fontSize: "0.813rem", minHeight: 36 },
      contained: {
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      },
      outlined: { borderWidth: 1.5, "&:hover": { borderWidth: 1.5 } },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: { backgroundImage: "none" },
      elevation1: {
        boxShadow:
          "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
      },
      elevation2: {
        boxShadow:
          "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
      },
      elevation3: {
        boxShadow:
          "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
      },
    },
  },
  MuiTextField: {
    defaultProps: { variant: "outlined", size: "small", margin: "dense" },
    styleOverrides: {
      root: {
        marginTop: 4,
        marginBottom: 4,
        "& .MuiOutlinedInput-root": {
          fontSize: "0.75rem",
          "&:hover fieldset": { borderColor: customColors.primary.main },
        },
        "& .MuiInputLabel-root": {
          fontSize: "0.875rem",
          transform: "translate(14px, 10px) scale(1)",
          "&.MuiInputLabel-shrink": {
            transform: "translate(14px, -9px) scale(0.75)",
            fontSize: "0.75rem",
          },
        },
        "& .MuiInputBase-input": {
          padding: "8px 12px",
          fontSize: "0.75rem",
          height: "auto",
          minHeight: 20,
        },
      },
    },
  },
  MuiFormControl: {
    defaultProps: { margin: "dense", size: "small" },
    styleOverrides: {
      root: { marginBottom: 8, marginTop: 8 },
      marginDense: { marginTop: 4, marginBottom: 4 },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: { fontSize: "0.75rem" },
      input: { fontSize: "0.75rem", "&::placeholder": { fontSize: "0.75rem" } },
    },
  },
  MuiSelect: {
    defaultProps: { size: "small" },
    styleOverrides: {
      select: { padding: "6px 10px", fontSize: "0.75rem", minHeight: 20 },
      icon: { fontSize: "1.125rem" },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: { fontSize: "0.75rem", minHeight: 32, padding: "4px 12px" },
    },
  },
  MuiAutocomplete: {
    defaultProps: { size: "small" },
    styleOverrides: {
      input: { fontSize: "0.75rem", padding: "2px 4px !important" },
      option: { fontSize: "0.75rem", padding: "4px 8px", minHeight: 32 },
    },
  },
  MuiChip: {
    defaultProps: { size: "small" },
    styleOverrides: {
      root: { fontWeight: 500, fontSize: "0.688rem", height: 24 },
      sizeSmall: { fontSize: "0.625rem", height: 20 },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: "0.688rem",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: "4px 8px",
      },
    },
  },
  MuiTable: { styleOverrides: { root: { fontSize: "0.75rem" } } },
  MuiTableCell: {
    styleOverrides: {
      root: { fontSize: "0.75rem", padding: "6px 12px" },
      sizeSmall: { padding: "4px 8px", fontSize: "0.688rem" },
      head: { fontSize: "0.75rem", fontWeight: 700, padding: "8px 12px" },
    },
  },
  MuiDialog: { styleOverrides: { paper: { borderRadius: 8 } } },
  MuiDialogTitle: {
    styleOverrides: { root: { fontSize: "1.125rem", padding: "12px 16px" } },
  },
  MuiDialogContent: {
    styleOverrides: { root: { padding: 16, fontSize: "0.75rem" } },
  },
  MuiDialogActions: { styleOverrides: { root: { padding: "8px 16px" } } },
  MuiCard: { styleOverrides: { root: { borderRadius: 8 } } },
  MuiCardContent: {
    styleOverrides: {
      root: { padding: 12, "&:last-child": { paddingBottom: 12 } },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: "none",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  MuiAppBar: { styleOverrides: { root: { backgroundImage: "none" } } },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
        "&.Mui-selected": {
          backgroundColor: "rgba(16, 185, 129, 0.08)",
          "&:hover": { backgroundColor: "rgba(16, 185, 129, 0.12)" },
        },
      },
    },
  },
  MuiAvatar: { styleOverrides: { root: { fontWeight: 600 } } },
};

export const darkComponentOverrides: Components<Theme> = {
  ...componentOverrides,
  MuiPaper: {
    styleOverrides: {
      root: { backgroundImage: "none", backgroundColor: "#1E293B" },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: "#1E293B",
        borderRight: "none",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: { backgroundColor: "#1E293B", backgroundImage: "none" },
    },
  },
};
