import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  subdivicionService,
  type CreateSubdivicionDTO,
} from "../services/subdivicionService";

export const useSubdivicion = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateSubdivicionDTO) =>
      subdivicionService.crear(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["predios"] });
    },
  });

  return {
    registrarSubdivicion: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    resetMutation: mutation.reset,
  };
};
