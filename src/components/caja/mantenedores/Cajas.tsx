import type React from "react";
import { CajasView } from "./CajasView";
import { useCajasController } from "./useCajasController";

const Cajas: React.FC = () => <CajasView controller={useCajasController()} />;

export default Cajas;
