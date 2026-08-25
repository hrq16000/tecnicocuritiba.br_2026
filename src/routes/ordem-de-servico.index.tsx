import { createFileRoute } from "@tanstack/react-router";
import OrdemDeServico from "@/pages/OrdemDeServico";

export const Route = createFileRoute("/ordem-de-servico/")({
  component: OrdemDeServico,
});
