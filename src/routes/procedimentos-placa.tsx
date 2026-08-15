import { createFileRoute } from "@tanstack/react-router";
import ProcedimentosPlaca from "@/pages/ProcedimentosPlaca";

export const Route = createFileRoute("/procedimentos-placa")({
  component: ProcedimentosPlaca,
});
