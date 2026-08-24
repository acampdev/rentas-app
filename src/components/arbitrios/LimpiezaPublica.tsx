import type React from "react";
import { LimpiezaPublicaView } from "./LimpiezaPublicaView";
import { useLimpiezaPublicaController } from "./useLimpiezaPublicaController";

const LimpiezaPublica: React.FC = () => (
  <LimpiezaPublicaView controller={useLimpiezaPublicaController()} />
);

export default LimpiezaPublica;
