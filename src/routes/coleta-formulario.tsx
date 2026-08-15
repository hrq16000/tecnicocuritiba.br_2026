import { createFileRoute } from "@tanstack/react-router";
import ColetaFormulario from "@/pages/ColetaFormulario";

export const Route = createFileRoute("/coleta-formulario")({
  component: ColetaFormulario,
});
