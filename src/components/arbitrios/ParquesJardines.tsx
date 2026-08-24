import { Box } from "@mui/material";
import { ParquesJardinesForm } from "./parquesJardines/ParquesJardinesForm";
import { ParquesJardinesSearch } from "./parquesJardines/ParquesJardinesSearch";
import { useParquesJardinesView } from "./parquesJardines/useParquesJardinesView";

const ParquesJardines = () => {
  const view = useParquesJardinesView();
  return (
    <Box sx={{ p: 3 }}>
      <ParquesJardinesForm
        form={view.form}
        setForm={view.setForm}
        routes={view.routeOptions}
        locations={view.locationOptions}
        loadingRoutes={view.loadingRoutes}
        loadingLocations={view.loadingLocations}
        loading={view.loading}
        onClear={view.clear}
        onSave={() => void view.save()}
      />
      <ParquesJardinesSearch
        year={view.searchYear}
        setYear={view.setSearchYear}
        visible={view.showTable}
        loading={view.loading}
        matrix={view.matrix}
        onSearch={view.search}
        onRateClick={view.editRate}
      />
    </Box>
  );
};

export default ParquesJardines;
