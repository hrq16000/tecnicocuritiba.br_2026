import { createFileRoute } from "@tanstack/react-router";
import EmpresaDeTiCuritiba from "@/pages/EmpresaDeTiCuritiba";

export const Route = createFileRoute("/empresa-de-ti-curitiba")({
  component: EmpresaDeTiCuritiba,
});
