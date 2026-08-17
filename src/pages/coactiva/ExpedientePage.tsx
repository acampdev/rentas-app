import ModuleUnavailablePage from '../ModuleUnavailablePage';

const ExpedientePage = () => (
  <ModuleUnavailablePage
    title="Expedientes coactivos no disponibles"
    description="El módulo de expedientes coactivos aún no está conectado a un API habilitado para el frontend. No se ejecutan consultas ni operaciones mientras permanezca fuera de servicio."
  />
);

export default ExpedientePage;
