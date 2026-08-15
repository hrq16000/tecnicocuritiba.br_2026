import { createFileRoute } from "@tanstack/react-router";
import AtendimentoRemoto from "@/pages/AtendimentoRemoto";

export const Route = createFileRoute("/atendimento-remoto")({
  component: AtendimentoRemoto,
});
