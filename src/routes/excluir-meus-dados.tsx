import { createFileRoute } from "@tanstack/react-router";
import ExcluirMeusDados from "@/pages/ExcluirMeusDados";

export const Route = createFileRoute("/excluir-meus-dados")({
  component: ExcluirMeusDados,
});
