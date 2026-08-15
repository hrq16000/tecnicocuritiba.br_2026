import { createFileRoute } from "@tanstack/react-router";
import SegurancaDosDados from "@/pages/SegurancaDosDados";

export const Route = createFileRoute("/seguranca-dos-dados")({
  component: SegurancaDosDados,
});
