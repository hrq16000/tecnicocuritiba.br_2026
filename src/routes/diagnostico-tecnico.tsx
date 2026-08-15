import { createFileRoute } from "@tanstack/react-router";
import DiagnosticoTecnico from "@/pages/DiagnosticoTecnico";

export const Route = createFileRoute("/diagnostico-tecnico")({
  component: DiagnosticoTecnico,
});
