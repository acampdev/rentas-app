import React, { useState } from "react";
import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import {
  Add as AddIcon,
  List as ListIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import PersonaForm from "../../components/persona/PersonaForm";
import PersonaList from "../../components/persona/PersonaList";
import { usePersonas } from "../../hooks/usePersonas";
import type { PersonaData } from "../../services/personaService";

const PersonaPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<PersonaData | null>(null);
  const { personas, loading, error, buscarPersonas } = usePersonas();
  const tab = location.pathname.includes("consulta") ? 1 : 0;
  const cambiarTab = (_: React.SyntheticEvent, value: number) =>
    navigate(value === 0 ? "/persona/nueva" : "/persona/consulta");
  const irANuevo = () => {
    setSelected(null);
    navigate("/persona/nueva");
  };

  return (
    <MainLayout title="Gestión de Personas">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <PersonIcon color="primary" fontSize="large" />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Personas
            </Typography>
            <Typography color="text.secondary">
              Registra y consulta personas naturales o jurídicas.
            </Typography>
          </Box>
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Tabs
            value={tab}
            onChange={cambiarTab}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              icon={<AddIcon />}
              iconPosition="start"
              label={selected ? "Editar persona" : "Nueva persona"}
            />
            <Tab
              icon={<ListIcon />}
              iconPosition="start"
              label="Consulta persona"
            />
          </Tabs>
          {tab === 0 ? (
            <PersonaForm
              persona={selected}
              onSaved={() => {
                setSelected(null);
                navigate("/persona/consulta");
              }}
            />
          ) : (
            <PersonaList
              personas={personas}
              loading={loading}
              onBuscar={(codTipoDocumento, numeroDocumento) =>
                buscarPersonas({ codTipoDocumento, numeroDocumento })
              }
              onEditar={(persona) => {
                setSelected(persona);
                navigate("/persona/nueva");
              }}
            />
          )}
        </Paper>
      </Box>
    </MainLayout>
  );
};
export default PersonaPage;
