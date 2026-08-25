import { createFileRoute } from "@tanstack/react-router";
import OrdemDeServicoConsulta from "@/pages/OrdemDeServicoConsulta";

export const Route = createFileRoute("/ordem-de-servico/$protocolo")({
  component: OrdemDeServicoConsulta,
});
