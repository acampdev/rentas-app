import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, DialogActions, Divider, Paper, Tooltip, Typography } from "@mui/material";

const Shortcut = ({ keyName, label }: { keyName: string; label: string }) => <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><Paper variant="outlined" sx={{ px: 1, py: 0.5, fontFamily: "monospace", fontWeight: 700 }}>{keyName}</Paper><Typography variant="caption" color="text.secondary">{label}</Typography></Box>;

export const DeudaDialogFooter = ({ onClose }: { onClose: () => void }) => <><Divider /><DialogActions sx={{ p: 2, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}><Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}><Typography variant="caption" fontWeight={700}>Atajos:</Typography><Shortcut keyName="F2" label="Nuevo" /><Shortcut keyName="F4" label="Pagar" /><Shortcut keyName="Esc" label="Cerrar" /></Box><Tooltip title="Cerrar (Esc)"><Button onClick={onClose} variant="outlined" color="error" startIcon={<CloseIcon />}>Cerrar</Button></Tooltip></DialogActions></>;
